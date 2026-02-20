import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const existingAdmin = await this.userModel.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const username = process.env.ADMIN_USER;
      const email = process.env.ADMIN_EMAIL;
      const password = process.env.ADMIN_PASSW;
      const hashedPasswd = await bcrypt.hash(password, 10);
      await this.userModel.create({
        username,
        email,
        password: hashedPasswd,
        role: 'admin',
      });
    }
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);
    return 'user created successfully';
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo id');
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('invalid mongo id');
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('invalid mongo id');
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async upateRole(userId: string, newRole: Role) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true },
    );
  }
}
