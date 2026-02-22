import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/auth/enums/role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  username: string;
  @Prop({ type: String })
  email: string;
  @Prop({ type: String })
  password: string;

  @Prop({ type: String, default: Role.USER })
  role: string;

  @Prop({ type: String })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
