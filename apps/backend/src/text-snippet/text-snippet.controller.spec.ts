import { Test, TestingModule } from '@nestjs/testing';
import { TextSnippetController } from './text-snippet.controller';
import { TextSnippetService } from './text-snippet.service';

describe('TextSnippetController', () => {
  let controller: TextSnippetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextSnippetController],
      providers: [TextSnippetService],
    }).compile();

    controller = module.get<TextSnippetController>(TextSnippetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
