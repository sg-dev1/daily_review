import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TextSnippet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  createdAt!: Date;

  @Column()
  text!: string;

  @Column()
  bookTitle!: string;

  @Column()
  bookAuthor!: string;

  @Column()
  note: string;

  @Column()
  location: string;

  // future: Tags (could be own table)
}
