import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class FindOne {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(100, { message: 'Email cannot exceed 100 characters' })
  email: string;
}
