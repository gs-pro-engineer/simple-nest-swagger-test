import { Controller, Get, Request, Post, UseGuards, Headers } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('auth')
export class AppController {
  constructor(
    private authService: AuthService
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiQuery({ name: 'password', type: 'string' })
  @ApiQuery({ name: 'username', type: 'string' })
  async login(@Request() req) {
    return this.authService.login(req.query);
  }

  @Get('refresh')
  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtAuthGuard)
  refreshTokens(@Headers() headers) {
    let refreshToken = headers.authorization;
    return this.authService.refreshTokens(refreshToken.split(" ")[1]);
  }
}

