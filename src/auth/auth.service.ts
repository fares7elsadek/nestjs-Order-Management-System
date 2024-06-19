import { HttpStatus, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { DatabaseService } from 'src/database/database.service';
import { AppError } from 'src/util/AppError';
import { BcryptService } from 'src/util/bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private readonly databaseservice:DatabaseService,
    private readonly jwtservice:JwtService
  ){}

  async register(registerDto:RegisterAuthDto) {
    const email = registerDto.email;
    const user = await this.databaseservice.user.findUnique({
      where: {
        email,
      }
    });
    if (user) {
      throw new AppError('email is already exist', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await new BcryptService().hashPassword(String(registerDto.password));
    const done = await this.databaseservice.user.create({
      data: {
        name: registerDto.name,
        email: email,
        password: String(hashedPassword),
        address: registerDto.address
      }
    });
    if (!done) {
      throw new AppError('something wrong has happened', HttpStatus.BAD_REQUEST);
    }
    const userData = {
      userId: done.userId,
      name: done.name,
      email: done.email,
      address: done.address
    }
    return userData;

  }

  async login(loginDto: LoginAuthDto) {
    const email = loginDto.email;
    const user = await this.databaseservice.user.findUnique({
      where: {
        email,
      }
    });
    if (!user) {
      throw new AppError('User does not exist', HttpStatus.BAD_REQUEST);
    }
    const usserPassword = user.password;
    const done = await await new BcryptService().comparePasswords(loginDto.password,user.password);
    if(!done){
      throw new AppError('not authorized', HttpStatus.FORBIDDEN);
    }
    const userData = {
      userId:user.userId,
      name:user.name,
      email:user.email,
      address:user.address,
    }
    const userToken = this.jwtservice.sign(userData);
    return {
      userData,
      userToken
    }
  }
}
