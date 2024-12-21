import { Test, TestingModule } from '@nestjs/testing';
import { TextSnippetService } from './text-snippet.service';

describe('TextSnippetService', () => {
  let service: TextSnippetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextSnippetService],
    }).compile();

    service = module.get<TextSnippetService>(TextSnippetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
