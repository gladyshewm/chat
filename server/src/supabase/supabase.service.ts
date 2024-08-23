import { Injectable, Logger } from '@nestjs/common';
import {
  AuthError,
  createClient,
  PostgrestError,
  SupabaseClient,
} from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export type SupabaseResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

export type SupabaseAuthResponse<T> = {
  data: T | null;
  error: AuthError | null;
};

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;
  private adminClient: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    const supabaseServiceRoleKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error(
        'Пропущена обязательная переменная окружения SUPABASE_URL или SUPABASE_KEY',
      );
      throw new Error('Missing SUPABASE_URL or SUPABASE_KEY');
    }

    this.client = createClient(supabaseUrl, supabaseKey);

    if (supabaseServiceRoleKey) {
      this.adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    } else {
      this.logger.warn(
        'Service Role Key не найден, операции администратора будут недоступны',
      );
    }
  }

  public getClient(): SupabaseClient {
    return this.client;
  }

  public getAdminClient(): SupabaseClient {
    if (!this.adminClient) {
      this.logger.error('Admin client не инициализирован');
      throw new Error('Admin client не инициализирован');
    }
    return this.adminClient;
  }

  public handleSupabaseResponse<T>(response: SupabaseResponse<T>): T | null {
    if (response.error) {
      this.logger.error(
        `Ошибка при обработке ответа от Supabase: ${response.error.message}`,
      );
      throw new Error(response.error.message);
    }

    return response.data;
  }

  public handleSupabaseAuthResponse<T>(
    response: SupabaseAuthResponse<T>,
  ): T | null {
    if (response.error) {
      this.logger.error(
        `Ошибка при обработке ответа от Supabase auth: ${response.error.message}`,
      );
      throw new Error(response.error.message);
    }

    return response.data;
  }
}
