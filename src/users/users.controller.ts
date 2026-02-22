import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SkipThrottle()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @SkipThrottle()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@User('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([Role.USER, Role.ADMIN])
  @Delete()
  remove(@User() id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/promote')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([Role.ADMIN])
  promote(@Param('id') userId: string) {
    return this.usersService.upateRole(userId, Role.ADMIN);
  }
}
