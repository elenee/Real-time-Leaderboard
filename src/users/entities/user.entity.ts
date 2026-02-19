import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  username: string;
  @Prop({ type: String })
  email: string;
  @Prop({ type: String })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
