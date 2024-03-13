import { Controller, Get, Param, Post, Body, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import { Response } from 'express';

@Controller('api/v1.0')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('add-user')
  async create(@Body() user: User, @Res() res: Response): Promise<void> {
    // return this.usersService.create(user);
    const createdUser = await this.usersService.create(user);
    res.status(200).send({
      success: true,
      message: 'User created successfully!',
      data: createdUser,
    });
  }

  @Get('users')
  async findAll(@Res() res: Response): Promise<void> {
    // return this.usersService.findAll();
    const users = await this.usersService.findAll();
    res.status(200).send({
      success: true,
      message: 'Users retrieved successfully!',
      data: users,
    });
  }

  @Get('get-user/:id')
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<void> {
    // return this.usersService.findOne(id);
    const user = await this.usersService.findOne(id);
    if (!user) {
      res.status(404).send({
        success: false,
        message: 'User not found!',
      });
      return;
    }
    res.status(200).send({
      success: true,
      message: 'User retrieved successfully!',
      data: user,
    });
  }
}
