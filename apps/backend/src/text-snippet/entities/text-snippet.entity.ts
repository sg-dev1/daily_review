import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class TextSnippet {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
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

  // ---
  // Relations

  @ManyToOne(() => User, (user) => user.textSnippets)
  user: User;

  @Column()
  userId: number;

  // future: Tags (could be own table)
}
