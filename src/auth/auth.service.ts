import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser)
      throw new BadRequestException('User with this email already exists');
    const hashedPassw = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassw,
    });
    return 'user created successfully';
  }

  async login(loginDto: LoginDto) {
    const existingUser = await this.usersService.findByEmail(loginDto.email);
    if (!existingUser) throw new BadRequestException('Invalid Credentials');

    const isPasswEqual = await bcrypt.compare(
      loginDto.password,
      existingUser.password,
    );

    if (!isPasswEqual) throw new BadRequestException('Invalid Credentials');

    const payload = {
      userId: existingUser._id,
      role: existingUser.role,
    };

    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.createRefreshToken(existingUser.id);
    return { accessToken, refreshToken };
  }

  async currentUser(userId) {
    const user = await this.usersService.findOne(userId);
    return user;
  }

  async createRefreshToken(userId) {
    const refreshToken = await this.jwtService.sign(
      { userId },
      { expiresIn: '7d' },
    );
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashed });
    return refreshToken;
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      await this.jwtService.verify(refreshToken);
      const decoded = await this.jwtService.decode(refreshToken);
      const user = await this.userModel.findOne({ refreshToken });
      if (!user) throw new UnauthorizedException();

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) throw new UnauthorizedException();

      const payload = {
        userId: user._id,
        role: user.role,
      };

      const accessToken = await this.jwtService.sign(payload, {
        expiresIn: '1h',
      });
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
