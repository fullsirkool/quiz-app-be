import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {}

  async findAll() {
    return []
  }
  async update(id: number, updateUserDto: UpdateUserDto) {}
  async remove(id: number) {}

  async findOne(id: number): Promise<User> {
    try {
      return await this.prismaService.user.findUnique({ where: { id } });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.prismaService.user.findUnique({ where: { email } });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findByCapcha(capcha: string): Promise<User> {
    try {
      return await this.prismaService.user.findFirst({ where: { capcha } });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
