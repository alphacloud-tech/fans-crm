import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from './user.model';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(user: User): Promise<User> {
    // Trim input
    user.password = this.hashPassword(user.password);
    return this.userModel.create(user);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({ attributes: { exclude: ['password'] } });
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findByPk(id, { attributes: { exclude: ['password'] } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  private hashPassword(password: string): string {
    return hashSync(password, 10); // Use bcrypt to hash the password
  }
}
