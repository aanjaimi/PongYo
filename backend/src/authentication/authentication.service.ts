import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';

@Injectable()
export class AuthenticationService {
  private prisma: PrismaClient;

  constructor(private jwtService: JwtService) {
    this.prisma = new PrismaClient();
  }

  // async getUsers(): Promise<User[]> {
  //   return this.prisma.user.findMany();
  // }

  // async createUser(data: Prisma.UserCreateInput): Promise<User> {
  //   return await this.prisma.user.create({ data });
  // }

  // async deleteUser(id: string): Promise<User> {
  //   return this.prisma.user.delete({ where: { id } });
  // }

  generateSecret(): string {
    const secret = speakeasy.generateSecret({ length: 6 }).base32;
    const otpCode = speakeasy.totp({
      secret: secret,
      encoding: 'base32',
    });
    return otpCode;
  }

  async createJwtToken(userName: string): Promise<string> {
    const payload = { sub: userName };
    try {
      return await this.jwtService.signAsync(payload);
    }
    catch (err) {
      console.error(err);
      throw new Error('Failed to create JWT token');
    }
  }

  // async closePrisma() {
  //   await this.prisma.$disconnect();
  // }
  async validateOrRegisterUser(profile: any): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: profile.id } });
      if (user) {
        return user;
      } else {
        const newUser = await this.prisma.user.create({
          data: {
            id: profile.id,
            displayname: profile.displayname,
            login: profile.login,
            email: profile.email,
            userStatus: profile.userStatus,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        return newUser;
      }
    }
    catch (err) {
      throw err;
    }
  }
}
