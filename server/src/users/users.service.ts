import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UserInfo } from 'src/graphql';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  public async findAll(): Promise<UserInfo[]> {
    const { data: users, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('id, name');
    if (error) {
      throw error;
    }
    return users;
  }

  /* public findOneById(id: number): any {
    return this.users.find((user) => user.id === id);
  } */
}
