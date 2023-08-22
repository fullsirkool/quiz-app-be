import { Inject, Injectable } from '@nestjs/common';
import {
  ChangePasswordDto,
  SignInDto,
  SignUpDto,
  ValidateDto,
} from './auth.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SenderService } from 'src/sender/sender.service';
import { HttpService } from '@nestjs/axios';
import { UserService } from 'src/user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as bcrypt from 'bcrypt';
import { getEmailContent } from './jwt.constants';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly senderService: SenderService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async validateUser(signInDto: SignInDto): Promise<User> {
    try {
      const { email, password } = signInDto;
      const findUser = await this.userService.findByEmail(email);
      if (findUser) {
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (isMatch) {
          if (findUser.activated) {
            return findUser;
          } else {
            throw new Error(
              'Your account has not already activated. Please check your email to verify!',
            );
          }
        } else {
          throw new Error('Wrong email or password!');
        }
      } else {
        throw new Error('Email has not already been registered!');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validateUserById(id: number): Promise<User> {
    try {
      const findUser = await this.userService.findOne(id);
      if (findUser.activated) {
        return findUser;
      } else {
        throw new Error(
          'Your account has not already activated. Please check your email to verify!',
        );
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        gender,
        role,
        dateOfBirth,
      } = signUpDto;
      const findUser = await this.userService.findByEmail(email);
      if (!findUser) {
        const bcryptSalt = +process.env.BCRYPT_SALT;
        const hash = await bcrypt.hash(password, bcryptSalt);
        const sendUser = {
          email,
          password: hash,
          firstName,
          lastName,
          gender,
          dateOfBirth,
          role,
        };
        const createdUser = await this.prismaService.user.create({
          data: sendUser,
        });
        const mailSubject = `Account Verification`;
        const mailContent = `Please enter the link to verify your account: ${createdUser.capcha}`;
        const html = getEmailContent(
          process.env.MAIL_REDIRECT_URL,
          createdUser.capcha,
        );
        this.senderService.sendEmail({
          to: createdUser.email,
          subject: mailSubject,
          text: mailContent,
          html,
        });
        return { msg: 'you have signed up' };
      } else {
        throw new Error('Email has already been registered!');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const { email, password } = signInDto;
      const findUser = await this.userService.findByEmail(email);
      if (findUser) {
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (isMatch) {
          if (findUser.activated) {
            const payload = { sub: findUser.id, role: findUser.role };
            const token = await this.jwtService.signAsync(payload);
            return {
              access_token: token,
            };
          } else {
            throw new Error(
              'Your account has not already activated. Please check your email to verify!',
            );
          }
        } else {
          throw new Error('Wrong email or password!');
        }
      } else {
        throw new Error('Email has not already been registered!');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signInWithGoogle(token: string) {
    try {
      const url = process.env.GOOGLE_INFOR_URL;
      const { data } = await firstValueFrom(
        this.httpService
          .post(
            url,
            {},
            {
              params: {
                id_token: token,
              },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              console.error(error);
              throw 'An error happened!';
            }),
          ),
      );
      const { email, name, picture, given_name, family_name } = data;
      const findUser = await this.userService.findByEmail(email);
      if (findUser) {
        if (findUser.activated) {
          const payload = { id: findUser.id };
          const token = await this.jwtService.signAsync(payload);
          return {
            access_token: token,
          };
        } else {
          throw new Error(
            'Your account has not already activated. Please check your email to verify!',
          );
        }
      } else {
        const tempUser = {
          email,
          firstName: given_name,
          lastName: family_name,
          avatarPicture: picture,
        };
        console.log('add temp user', tempUser);
        await this.cacheManager.set('temp-user', tempUser, 1000000);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async changePassword(passObj: ChangePasswordDto) {
    try {
      const { oldPassword, newPassword } = passObj;
      const tempUser = (await this.cacheManager.get('temp-user')) as object;
      console.log('tempUser', tempUser);
      if (tempUser) {
        const user = {
          ...tempUser,
          password: newPassword,
          capcha: null,
        } as User;
        await this.prismaService.user.create({ data: user });
        await this.cacheManager.del('temp-user');
        return true;
      }
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async verify(capcha: string): Promise<boolean> {
    try {
      const findUser = await this.prismaService.user.findFirst({
        where: { capcha },
      });
      if (findUser) {
        const updatedUser = await this.prismaService.user.update({
          where: { id: findUser.id },
          data: {
            capcha: '',
            activated: true,
          },
        });
        return true;
      } else {
        throw new Error('Could not find account with capcha!');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
