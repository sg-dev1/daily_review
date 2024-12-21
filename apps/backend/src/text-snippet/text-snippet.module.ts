import { Module } from '@nestjs/common';
import { TextSnippetService } from './text-snippet.service';
import { TextSnippetController } from './text-snippet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextSnippet } from './entities/text-snippet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TextSnippet])],
  controllers: [TextSnippetController],
  providers: [TextSnippetService],
})
export class TextSnippetModule {}
