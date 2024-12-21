import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TextSnippet } from 'src/text-snippet/entities/text-snippet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TextSnippet])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
