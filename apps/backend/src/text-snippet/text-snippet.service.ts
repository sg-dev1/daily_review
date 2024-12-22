import { HttpException, Injectable } from '@nestjs/common';
import { CreateTextSnippetDto } from './dto/create-text-snippet.dto';
import { UpdateTextSnippetDto } from './dto/update-text-snippet.dto';
import { TextSnippet } from './entities/text-snippet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TextSnippetService {
  constructor(
    @InjectRepository(TextSnippet)
    private readonly textSnippetRepository: Repository<TextSnippet>,
  ) {}

  async create(
    createTextSnippetDto: CreateTextSnippetDto,
    user: User,
  ): Promise<TextSnippet> {
    const textSnippet = { ...createTextSnippetDto, userId: user.id };
    const userData = await this.textSnippetRepository.create(textSnippet);
    return this.textSnippetRepository.save(userData);
  }

  async createMany(
    createTextSnippetDtos: CreateTextSnippetDto[],
    user: User,
  ): Promise<TextSnippet[]> {
    const textSnippets = createTextSnippetDtos.map((dto) => ({
      ...dto,
      userId: user.id,
    }));
    const userData = await this.textSnippetRepository.create(textSnippets);
    return this.textSnippetRepository.save(userData);
  }

  async findAll(): Promise<TextSnippet[]> {
    return await this.textSnippetRepository.find();
  }

  async findOne(id: number): Promise<TextSnippet> {
    const data = await this.textSnippetRepository.findOneBy({ id });
    if (!data) {
      throw new HttpException('Text Snippet Not Found', 404);
    }
    return data;
  }

  async update(
    id: number,
    updateTextSnippetDto: UpdateTextSnippetDto,
  ): Promise<TextSnippet> {
    const existingTextSnippet = await this.findOne(id);
    const textSnippetData = this.textSnippetRepository.merge(
      existingTextSnippet,
      updateTextSnippetDto,
    );
    return await this.textSnippetRepository.save(textSnippetData);
  }

  async remove(id: number): Promise<TextSnippet> {
    const existingTextSnippet = await this.findOne(id);
    return await this.textSnippetRepository.remove(existingTextSnippet);
  }
}
