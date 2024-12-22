import { ApiProperty } from '@nestjs/swagger';

export class TextSnippetUploadDto {
  // Is there a better format for CSV?
  // With binary we get a file upload button in swagger
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export interface TextSnippetCsvRowType {
  hightlight: number;
  bookTitle: number;
  bookAuthor: number;
  amazonBookId: number;
  note: number;
  color: number;
  tags: number;
  locationType: number;
  location: number;
  highlightedAt: number;
  documentTags: number;
}

export interface TextSnippetCsvType {
  hightlight: string;
  bookTitle: string;
  bookAuthor: string;
  amazonBookId: string;
  note: string;
  color: string;
  tags: string;
  locationType: string;
  location: string;
  highlightedAt: string;
  documentTags: string;
}
