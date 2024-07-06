import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Info, UserInfo } from 'src/graphql';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async getUser(): Promise<UserInfo> | null {
    try {
      const {
        data: { session },
      } = await this.supabaseService.getClient().auth.getSession();
      if (session) {
        const { user } = session;
        return {
          id: user.id,
          name: user.user_metadata.name,
          email: user.email,
        };
      }
      return null;
    } catch (error) {
      console.error('Ошибка получения пользователя:', error.message);
      throw error;
    }
  }

  async findAll(): Promise<Info[]> {
    const { data: users, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('id, name');
    if (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return users;
  }

  /* public findOneById(id: number): any {
    return this.users.find((user) => user.id === id);
  } */
}
