import { Injectable, ForbiddenException, } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common/exceptions';
import jwt_decode from 'jwt-decode';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findUser(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userdata: any) {
    // Check if user exists
    const user = await this.usersService.findUser(userdata.username);
    if (!user) throw new BadRequestException('User does not exist');
    if (user.password !== userdata.password)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.userId, user.username);
    await this.updateTokens(user.userId, tokens);
    return tokens;
  }
  
  async refreshTokens(refreshToken: string) {
    let userData = jwt_decode(refreshToken);
    const user = await this.usersService.findUser(userData['username']);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.userId, user.username);
    await this.updateTokens(user.userId, tokens);
    return tokens;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateTokens(userId: number, tokens: any) {
    const hashedAccessToken = await this.hashData(tokens.accessToken);
    const hashedRefreshToken = await this.hashData(tokens.refreshToken);
    await this.usersService.updateTokens(userId, { hashedAccessToken, hashedRefreshToken });
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: jwtConstants.secret,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: jwtConstants.secret,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}