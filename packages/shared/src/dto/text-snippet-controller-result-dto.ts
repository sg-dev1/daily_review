import { CreateTextSnippetDtoType } from './text-snippet-controller-types';

export interface TextSnippedDto extends CreateTextSnippetDtoType {
  id: number;
  reviewCount: number;
}

export interface TextSnippetControllerResult {
  success: boolean;
  message: string;
}

export interface TextSnippetControllerResultWithData extends TextSnippetControllerResult {
  data: TextSnippedDto[];
}

export interface TextSnippetControllerResultWithSingleData extends TextSnippetControllerResult {
  data: TextSnippedDto | null;
}
