import { ApiProperty } from '@nestjs/swagger';
import { CreateTextSnippetDtoType } from '@repo/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTextSnippetDto implements CreateTextSnippetDtoType {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  text!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  bookTitle!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  bookAuthor!: string;

  @ApiProperty({ required: true })
  @IsString()
  note!: string;

  @ApiProperty({ required: true })
  @IsString()
  location!: string;
}
