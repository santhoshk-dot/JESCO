import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginDto } from './dto/login.dto';
import twilio from 'twilio';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 🔢 In-memory OTP store
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  // 📞 Twilio client setup
  private twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

  /** 📲 Send OTP for signup */
  async sendOtp(mobile: string) {
    if (!mobile) throw new BadRequestException('Mobile number is required');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // valid for 5 minutes
    this.otpStore.set(mobile, { otp, expiresAt });

    try {
      const phoneNumber = mobile.startsWith('+') ? mobile : `+91${mobile}`;
      await this.twilioClient.messages.create({
        body: `🔐 Your Jesco verification code: ${otp}. It expires in 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      return { message: 'OTP sent successfully' };
    } catch (err) {
      console.error('❌ Error sending OTP via Twilio:', err);
      throw new BadRequestException('Failed to send OTP: ' + err.message);
    }
  }

  /** 🧍 Signup with OTP verification + secure role assignment */
  async signup(data: any) {
    const { name, email, password, mobile, otp, role, adminSecret } = data;

    // ✅ Validate OTP
    const stored = this.otpStore.get(mobile);
    if (!stored || stored.otp !== otp || stored.expiresAt < Date.now()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // ✅ Prevent duplicate emails
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new ConflictException('Email already registered');

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Role control — secure admin creation
    let assignedRole: 'user' | 'admin' = 'user';
    if (role === 'admin') {
      if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
        throw new ForbiddenException('Invalid admin secret');
      }
      assignedRole = 'admin';
    }

    // ✅ Create the user
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      isVerified: true,
      role: assignedRole,
    });

    // Remove OTP once used
    this.otpStore.delete(mobile);

    const token = this.generateJwt(user);

    return {
      message: 'User registered successfully',
      token,
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  /** 🔑 Login */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.generateJwt(user);
    return {
      token,
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  /** 🎟️ Generate JWT */
  generateJwt(user: any) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  /** 🔍 Validate JWT payload */
  async validateUser(payload: { sub: string; email: string }) {
    return this.usersService.findById(payload.sub);
  }

  /** 🔐 Request password reset */
  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user)
      return { message: 'If this email exists, a reset link has been sent' };

    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await this.usersService.setResetToken(email, token, tokenExpiry);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`;
    await transporter.sendMail({
      from: `"Jesco Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Hi ${user.name},</p>
             <p>You requested a password reset. Click below:</p>
             <p><a href="${resetLink}" style="padding:10px 16px;background:#000;color:#fff;border-radius:6px;text-decoration:none;">Reset Password</a></p>
             <p>Valid for 15 minutes.</p>`,
    });

    return { message: 'Password reset email sent successfully' };
  }

  /** 🔁 Reset password */
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.email, hashedPassword);
    return { message: 'Password reset successful' };
  }
}
