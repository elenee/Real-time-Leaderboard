import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(@InjectModel('Game') private gameModel: Model<Game>) {}

  async create(createGameDto: CreateGameDto) {
    const slug = createGameDto.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingGame = await this.gameModel.findOne({ slug });
    if (existingGame) {
      throw new ConflictException('A game with this name already exists');
    }
    const game = await this.gameModel.create({ ...createGameDto, slug });
    return game;
  }

  findAll() {
    return this.gameModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo id');
    const game = await this.gameModel.findById(id);
    if (!game) throw new NotFoundException();
    return game;
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo id');
    const game = await this.gameModel.findByIdAndUpdate(id, updateGameDto, {
      new: true,
    });
    if (!game) throw new NotFoundException();
    return game;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo id');
    const game = await this.gameModel.findByIdAndDelete(id);
    if (!game) throw new NotFoundException();
    return 'game deleted';
  }
}
