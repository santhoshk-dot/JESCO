import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Send OTP
  @Post('send-otp')
  async sendOtp(@Body('mobile') mobile: string) {
    if (!mobile) {
      throw new BadRequestException('Mobile number is required');
    }
    return this.authService.sendOtp(mobile);
  }

  // Signup with OTP
  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  // Login — returns JWT and user info
  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      const { token, user } = await this.authService.login(body); // returns { token, user }
      return { token, user }; // consistent key for frontend
    } catch (err) {
      throw new BadRequestException('Invalid email or password');
    }
  }

  // Forgot password
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(body.email);
  }

  // Reset password
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
