import { Module } from '@nestjs/common';
import { TextSnippetService } from './text-snippet.service';
import { TextSnippetController } from './text-snippet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextSnippet } from './entities/text-snippet.entity';
import { MulterModule } from '@nestjs/platform-express';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TextSnippet, User]),
    MulterModule.register({
      dest: './uploads/csv',
    }),
  ],
  controllers: [TextSnippetController],
  providers: [TextSnippetService],
  exports: [TextSnippetService],
})
export class TextSnippetModule {}
