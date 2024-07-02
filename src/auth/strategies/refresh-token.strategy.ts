import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  // constructor(private usersService: UsersService) {
    constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      // passReqToCallback: true,
    });
  }

  // async validate(req: Request, payload: TUserPayloadToken) {
    async validate(payload: any) {
    // const user = await this.usersService.findById(payload.sub);
    // if (!user) throw new BadRequestException('User not found');

    // const [type, refreshTokenInHeaders] =
    //   req.headers.authorization?.split(' ') ?? [];

    // if (refreshTokenInHeaders !== user.refreshToken)
    //   throw new BadRequestException('Please re login');

    return payload;
  }
}
