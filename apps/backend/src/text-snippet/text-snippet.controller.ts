import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TextSnippetService } from './text-snippet.service';
import { CreateTextSnippetDto } from './dto/create-text-snippet.dto';
import { UpdateTextSnippetDto } from './dto/update-text-snippet.dto';
import {
  TextSnippetControllerResult,
  TextSnippetControllerResultWithData,
  TextSnippetControllerResultWithSingleData,
} from '@repo/shared';
import { TextSnippet } from './entities/text-snippet.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { csvFileFilter, csvFileName } from '../utils/fileUploadUtils';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  TextSnippetCsvRowType,
  TextSnippetCsvType,
  TextSnippetUploadDto,
} from './dto/texsnippet-upload.dto';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import { checkedHttpException } from '../utils/checkedHttpException';
import { GetUser } from '../auth/utils/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { Roles } from '../auth/utils/roles.decorator';
import { Role } from '../auth/utils/role.enum';
import { checkedModifyOperation } from '../utils/modify.check';

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
  @Roles(Role.Admin)
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

  @Get('list')
  async findAllForUser(
    @GetUser() executingUser: User,
  ): Promise<TextSnippetControllerResultWithData> {
    try {
      const data: TextSnippet[] =
        await this.textSnippetService.findAllForUser(executingUser);
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
    @GetUser() executingUser: User,
    @Param('id') id: string,
  ): Promise<TextSnippetControllerResultWithSingleData> {
    let data: TextSnippet | null = null;
    try {
      data = await this.textSnippetService.findOne(+id);
    } catch (error: unknown) {
      return {
        success: false,
        message: checkedHttpException(error),
        data: null,
      };
    }

    const nonNullData: TextSnippet = data;
    checkedModifyOperation(executingUser, nonNullData.userId);

    return {
      success: true,
      data: nonNullData,
      message: 'Text Snippet Fetched Successfully',
    };
  }

  @Patch(':id')
  async update(
    @GetUser() executingUser: User,
    @Param('id') id: string,
    @Body() updateTextSnippetDto: UpdateTextSnippetDto,
  ): Promise<TextSnippetControllerResult> {
    // only to check if access of this data is allowed
    const data = await this.textSnippetService.findOne(+id);
    checkedModifyOperation(executingUser, data.userId);

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
  async remove(
    @GetUser() executingUser: User,
    @Param('id') id: string,
  ): Promise<TextSnippetControllerResult> {
    // only to check if access of this data is allowed
    const data = await this.textSnippetService.findOne(+id);
    checkedModifyOperation(executingUser, data.userId);

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

  async processCsvFile(filepath: string): Promise<TextSnippetCsvType[]> {
    const parser = fs.createReadStream(filepath).pipe(
      parse({
        // CSV options if any
      }),
    );
    // Catch any error
    parser.on('error', function (err) {
      console.error(err.message);
    });

    const records: TextSnippetCsvType[] = [];
    let textSnippetCsvRows: TextSnippetCsvRowType | null = null;
    for await (const record of parser) {
      if (textSnippetCsvRows === null) {
        textSnippetCsvRows = this.obtainCsvRows(record);
      } else {
        const textSnippetCsvRow = {
          hightlight: record[textSnippetCsvRows.hightlight],
          bookTitle: record[textSnippetCsvRows.bookTitle],
          bookAuthor: record[textSnippetCsvRows.bookAuthor],
          amazonBookId: record[textSnippetCsvRows.amazonBookId],
          note: record[textSnippetCsvRows.note],
          color: record[textSnippetCsvRows.color],
          tags: record[textSnippetCsvRows.tags],
          locationType: record[textSnippetCsvRows.locationType],
          location: record[textSnippetCsvRows.location],
          highlightedAt: record[textSnippetCsvRows.highlightedAt],
          documentTags: record[textSnippetCsvRows.documentTags],
        };
        // Work with each record
        records.push(textSnippetCsvRow);
      }
    }

    return records;
  }

  // Get the csv file row indices
  obtainCsvRows(header: string[]): TextSnippetCsvRowType {
    /*
      [
        'Highlight',
        'Book Title',
        'Book Author',
        'Amazon Book ID',
        'Note',
        'Color',
        'Tags',
        'Location Type',
        'Location',
        'Highlighted at',
        'Document tags'
      ]
    */
    return {
      hightlight: header.findIndex((value) => value === 'Highlight'),
      bookTitle: header.findIndex((value) => value === 'Book Title'),
      bookAuthor: header.findIndex((value) => value === 'Book Author'),
      amazonBookId: header.findIndex((value) => value === 'Amazon Book ID'),
      note: header.findIndex((value) => value === 'Note'),
      color: header.findIndex((value) => value === 'Color'),
      tags: header.findIndex((value) => value === 'Tags'),
      locationType: header.findIndex((value) => value === 'Location Type'),
      location: header.findIndex((value) => value === 'Location'),
      highlightedAt: header.findIndex((value) => value === 'Highlighted at'),
      documentTags: header.findIndex((value) => value === 'Document tags'),
    };
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Text Snippet CSV file',
    type: TextSnippetUploadDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/csv',
        filename: csvFileName,
      }),
      fileFilter: csvFileFilter,
    }),
  )
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<TextSnippetControllerResult> {
    //console.log(file);
    const csvPath = file.path;
    const records = await this.processCsvFile(csvPath);
    //console.log(records[0]);

    const createTextSnippetDtos: CreateTextSnippetDto[] = records.map(
      (record: TextSnippetCsvType) => ({
        text: record.hightlight,
        bookTitle: record.bookTitle,
        bookAuthor: record.bookAuthor,
        note: record.note,
        location: record.location,
      }),
    );

    const filteredTextSnippets = createTextSnippetDtos.filter(
      (dto) => dto.text !== '',
    );
    const removedTextSnippets = createTextSnippetDtos.filter(
      (dto) => dto.text === '',
    );
    if (removedTextSnippets.length > 0) {
      console.log(
        'Removed the following text snippets, because its text was empty: ',
        removedTextSnippets,
      );
    }

    try {
      await this.textSnippetService.createMany(filteredTextSnippets, user);

      return {
        success: true,
        message: `Text Snippets from '${file.originalname}' imported successfully`,
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: checkedHttpException(error),
      };
    }
  }
}
