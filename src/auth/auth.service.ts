import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
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
    };

    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
    return { accessToken };
  }

  async currentUser(userId) {
    const user = await this.usersService.findOne(userId);
    return user;
  }
}
