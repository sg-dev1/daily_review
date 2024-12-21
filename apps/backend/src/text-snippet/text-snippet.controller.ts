import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TextSnippetService } from './text-snippet.service';
import { CreateTextSnippetDto } from './dto/create-text-snippet.dto';
import { UpdateTextSnippetDto } from './dto/update-text-snippet.dto';
import { checkedHttpException } from 'src/utils/checkedHttpException';
import {
  TextSnippetControllerResult,
  TextSnippetControllerResultWithData,
  TextSnippetControllerResultWithSingleData,
} from '@repo/shared';
import { TextSnippet } from './entities/text-snippet.entity';
import { GetUser } from 'src/auth/utils/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('text-snippet')
export class TextSnippetController {
  constructor(private readonly textSnippetService: TextSnippetService) {}

  @Post()
  async create(
    @Body() createTextSnippetDto: CreateTextSnippetDto,
    @GetUser() user: User,
  ): Promise<TextSnippetControllerResult> {
    try {
      await this.textSnippetService.create(createTextSnippetDto, user);

      return {
        success: true,
        message: 'Text Snippet Created Successfully',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: checkedHttpException(error),
      };
    }
  }

  @Get()
  async findAll(): Promise<TextSnippetControllerResultWithData> {
    try {
      const data: TextSnippet[] = await this.textSnippetService.findAll();
      const dataAsDto: TextSnippet[] = data.map(
        (entity: TextSnippet) => entity,
      );
      return {
        success: true,
        data: dataAsDto,
        message: 'Text Snippet Fetched Successfully',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: checkedHttpException(error),
        data: [],
      };
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<TextSnippetControllerResultWithSingleData> {
    try {
      const data = await this.textSnippetService.findOne(+id);
      return {
        success: true,
        data,
        message: 'Text Snippet Fetched Successfully',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: checkedHttpException(error),
        data: null,
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTextSnippetDto: UpdateTextSnippetDto,
  ): Promise<TextSnippetControllerResult> {
    try {
      await this.textSnippetService.update(+id, updateTextSnippetDto);
      return {
        success: true,
        message: 'Text Snippet Updated Successfully',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: checkedHttpException(error),
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TextSnippetControllerResult> {
    try {
      await this.textSnippetService.remove(+id);
      return {
        success: true,
        message: 'Text Snippet Deleted Successfully',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: checkedHttpException(error),
      };
    }
  }
}
