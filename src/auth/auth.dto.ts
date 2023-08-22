import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { Gender, RoleType } from '@prisma/client';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
  gender: Gender;
  role: RoleType;
  dateOfBirth: Date;
}

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class ChangePasswordDto {
  oldPassword: string;
  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;
}
export class ValidateDto {
  @IsEmail()
  @IsNotEmpty()
  email: String;

  @IsStrongPassword()
  @IsNotEmpty()
  password: String;
}

export interface JwtPayload {
  sub: number; // User ID
  role: RoleType;
}