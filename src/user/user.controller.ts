import { UserService } from './user.service';
import { GetUser } from './../auth/decorator/get-user.decorator';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtGuard)
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser('') user: User) {
    const words = ['beautiful', 'language', 'pictures', 'comfortable', 'know'];
    return {
      ...user,
      words,
    };
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
