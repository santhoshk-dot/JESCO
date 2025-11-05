import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  // 🧩 Optional role field (user/admin)
  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: 'user' | 'admin';

  // 🧩 Optional admin secret key (for admin signup only)
  @IsOptional()
  @IsString()
  adminSecret?: string;

  // 🧩 Optional verification status
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
