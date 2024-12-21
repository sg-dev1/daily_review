import { Module } from '@nestjs/common';
import { TextSnippetService } from './text-snippet.service';
import { TextSnippetController } from './text-snippet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextSnippet } from './entities/text-snippet.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TextSnippet, User])],
  controllers: [TextSnippetController],
  providers: [TextSnippetService],
  exports: [],
})
export class TextSnippetModule {}
