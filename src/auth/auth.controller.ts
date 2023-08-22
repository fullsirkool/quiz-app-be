import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, SignInDto, SignUpDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  async signin(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('/signin-google')
  async signInWithGoogle(@Query('token') token: string) {
    return this.authService.signInWithGoogle(token);
  }

  @Patch('verify/:capcha')
  async verify(@Param('capcha') capcha: string) {
    const success = await this.authService.verify(capcha);
    return { success };
  }

  @Patch('/change-password')
  async changePassword(@Body() passwordObj: ChangePasswordDto) {
    const success = await this.authService.changePassword(passwordObj);
    return { success };
  }
}
