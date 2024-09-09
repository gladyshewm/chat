import { Test, TestingModule } from '@nestjs/testing';
import { AuthError, createClient, PostgrestError } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { Logger } from '@nestjs/common';
import { mockConfigService } from './__mocks__/config.service.mock';

jest.mock('@supabase/supabase-js');

describe('SupabaseService', () => {
  let supabaseService: SupabaseService;
  let configService: jest.Mocked<ConfigService>;

  const mockSupabaseClient = {
    auth: {
      refreshSession: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    insert: jest.fn(),
  };

  const mockCreateClient = createClient as jest.MockedFunction<
    typeof createClient
  >;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockCreateClient.mockReturnValue(mockSupabaseClient as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    supabaseService = module.get<SupabaseService>(SupabaseService);
    configService = module.get<jest.Mocked<ConfigService>>(ConfigService);
  });

  it('should be defined', () => {
    expect(supabaseService).toBeDefined();
  });

  describe('initialization', () => {
    it('should initialize client correctly', () => {
      const supabaseUrl = configService.get<string>('SUPABASE_URL');
      const supabaseKey = configService.get<string>('SUPABASE_KEY');
      const supabaseServiceRoleKey = configService.get<string>(
        'SUPABASE_SERVICE_ROLE_KEY',
      );

      expect(createClient).toHaveBeenCalledTimes(2);
      expect(createClient).toHaveBeenCalledWith(supabaseUrl, supabaseKey);
      expect(createClient).toHaveBeenCalledWith(
        supabaseUrl,
        supabaseServiceRoleKey,
      );
    });

    it('should throw error if SUPABASE_URL or SUPABASE_KEY is missing', () => {
      configService.get
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(undefined);

      expect(() => new SupabaseService(configService)).toThrow(
        'Missing SUPABASE_URL or SUPABASE_KEY',
      );
    });

    it('should log warning if service role key is missing', () => {
      configService.get
        .mockReturnValueOnce('http://supabase-url')
        .mockReturnValueOnce('supabase-key')
        .mockReturnValueOnce(undefined);

      const loggerSpy = jest.spyOn(Logger.prototype, 'warn');

      new SupabaseService(configService);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Service Role Key не найден'),
      );
    });
  });

  describe('getClient', () => {
    it('should return the client', () => {
      expect(supabaseService.getClient()).toBe(mockSupabaseClient);
    });
  });

  describe('getAdminClient', () => {
    it('should return the admin client if initialized', () => {
      expect(supabaseService.getAdminClient()).toBe(mockSupabaseClient);
    });

    it('should throw error if admin client is not initialized', () => {
      configService.get
        .mockReturnValueOnce('http://supabase-url')
        .mockReturnValueOnce('supabase-key')
        .mockReturnValueOnce(undefined);

      const supabaseService = new SupabaseService(configService);

      expect(() => supabaseService.getAdminClient()).toThrow(
        'Admin client не инициализирован',
      );
    });
  });

  describe('handleSupabaseResponse', () => {
    it('should return data if no error', () => {
      const response = { data: { id: 1 }, error: null };

      expect(supabaseService.handleSupabaseResponse(response)).toEqual({
        id: 1,
      });
    });

    it('should throw error if response contains error', () => {
      const response = {
        data: null,
        error: { message: 'Test Error' } as PostgrestError,
      };

      expect(() => supabaseService.handleSupabaseResponse(response)).toThrow(
        'Test Error',
      );
    });
  });

  describe('handleSupabaseAuthResponse', () => {
    it('should return data if no error', () => {
      const response = { data: { id: 1 }, error: null };

      expect(supabaseService.handleSupabaseAuthResponse(response)).toEqual({
        id: 1,
      });
    });

    it('should throw error if response contains error', () => {
      const response = {
        data: null,
        error: { message: 'Test Error' } as AuthError,
      };

      expect(() =>
        supabaseService.handleSupabaseAuthResponse(response),
      ).toThrow('Test Error');
    });
  });
});
