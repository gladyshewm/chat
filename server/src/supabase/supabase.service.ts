import { Injectable, Logger } from '@nestjs/common';
import {
  createClient,
  PostgrestError,
  SupabaseClient,
} from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export type SupabaseResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error(
        'Пропущена обязательная переменная окружения SUPABASE_URL или SUPABASE_KEY',
      );
      throw new Error('Missing SUPABASE_URL or SUPABASE_KEY');
    }

    this.client = createClient(supabaseUrl, supabaseKey);
  }

  public getClient(): SupabaseClient {
    return this.client;
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
}
