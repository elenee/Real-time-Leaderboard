import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

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
}
