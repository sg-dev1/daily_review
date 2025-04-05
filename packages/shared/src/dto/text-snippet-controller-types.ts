export interface CreateTextSnippetDtoType {
  text: string;
  bookTitle: string;
  bookAuthor: string;
  note: string;
  location: string;
}

export interface UpdateTextSnippetDtoType extends Partial<CreateTextSnippetDtoType> {
  id: number;
}
