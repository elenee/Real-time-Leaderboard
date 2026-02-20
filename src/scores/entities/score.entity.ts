import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Score {
  @Prop({ type: Number, required: true, index: true })
  score: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game' })
  gameId: mongoose.Schema.Types.ObjectId;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
