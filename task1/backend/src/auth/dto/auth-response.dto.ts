import { Expose } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

export class AuthResponseDto {
  @Expose()
  access_token: string;

  @Expose()
  user: UserResponseDto;
}
