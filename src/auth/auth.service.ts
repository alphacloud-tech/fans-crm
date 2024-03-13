import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new BadRequestException();

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new UnauthorizedException(
        'Invalid credentials. Please check your username and password!',
      );

    return user;
  }

  async generateToken(user: any) {
    const payload = {
      id: user.id,
      surname: user.surname,
      first_name: user.first_name,
      email: user.email,
      sub: user.id,
    };

    // Create the JWT token without the prefix
    const token = this.jwtService.sign(payload);

    const data = {
      token: token,
      user: user,
    };

    return {
      status: HttpStatus.OK,
      success: true,
      message: 'Login was successful.',
      data: data,
    };
  }
}
