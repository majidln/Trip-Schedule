import { GetUser } from './../auth/decorator/get-user.decorator';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  @Get('me')
  getMe(@GetUser('') user: User) {
    const words = ['beautiful', 'language', 'pictures', 'comfortable', 'know'];
    return {
      ...user,
      words,
    };
  }
}