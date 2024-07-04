import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Info } from 'src/graphql';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

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
