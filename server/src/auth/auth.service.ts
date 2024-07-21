import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { AuthPayload, UserInfo, UserInput } from 'src/graphql';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private supabaseService: SupabaseService) {}

  async createUser(userInput: UserInput): Promise<AuthPayload> {
    const profile_id: string = Date.now().toString();
    const { data, error: authError } = await this.supabaseService
      .getClient()
      .auth.signUp({
        email: userInput.email,
        password: userInput.password,
        options: {
          data: {
            name: userInput.name,
            profile_id: profile_id,
          },
        },
      });
    if (authError) {
      this.logger.error('Ошибка при регистрации:', authError.message);
      throw new HttpException(authError.message, HttpStatus.BAD_REQUEST);
    }

    const { error: profileError } = await this.supabaseService
      .getClient()
      .from('profiles')
      .insert({
        id: profile_id,
        name: userInput.name,
        uuid: data.user.id,
      });

    if (profileError) {
      this.logger.error('Ошибка при регистрации:', profileError.message);
      throw new HttpException(profileError.message, HttpStatus.BAD_REQUEST);
    }

    const user: UserInfo = {
      uuid: profile_id,
      name: userInput.name,
      email: userInput.email,
    };

    return { user, token: data.session.access_token };
  }

  async logInUser(email: string, password: string): Promise<AuthPayload> {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      this.logger.error('Ошибка при входе в систему:', error.message);
      throw new UnauthorizedException({ message: error.message });
    }

    const user = {
      uuid: data.user.id,
      name: data.user.user_metadata.name,
      email: data.user.email,
    };

    return { user, token: data.session.access_token };
  }

  async logOutUser(): Promise<boolean> {
    const { error } = await this.supabaseService.getClient().auth.signOut();
    if (error) {
      this.logger.error('Ошибка при выходе из системы:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return true;
  }
}
