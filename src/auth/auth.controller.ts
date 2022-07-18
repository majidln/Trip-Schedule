import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({ description: 'User registration' })
  @ApiBody({ type: AuthDto, description: 'Register body' })
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOkResponse({ description: 'User Login' })
  @ApiUnauthorizedResponse({ description: 'Credential is invalid' })
  @ApiBody({ type: AuthDto, description: 'Login body' })
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
