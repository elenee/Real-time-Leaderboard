import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Game {
  @Prop({ type: String, unique: true, trim: true })
  name: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String, unique: true, index: true })
  slug: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
