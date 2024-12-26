import { UserDto } from '@repo/shared';
import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { TextSnippet } from '../../text-snippet/entities/text-snippet.entity';

export enum FilterReviewSelectionStrategyType {
  AUTHOR = 'author',
  TITLE = 'title',
  BOTH = 'both',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Index({
    unique: true,
  })
  @Column()
  username!: string;

  // password also includes the salt, see https://www.npmjs.com/package/bcrypt
  @Column()
  @Exclude({
    toPlainOnly: true,
  })
  password!: string;

  @Column()
  numReviewItemsToSend!: number;

  @Column()
  reviewFreqAndTime!: string;

  @Column({
    type: 'enum',
    enum: FilterReviewSelectionStrategyType,
    default: FilterReviewSelectionStrategyType.TITLE,
  })
  filterReviewSelectionStrategyType!: FilterReviewSelectionStrategyType;

  @Column({ default: '' })
  filterReviewStrategyAuthor!: string;

  @Column({ default: '' })
  filterReviewStrategyTitle!: string;

  // ---
  // Relations

  @OneToMany(() => TextSnippet, (textSnippet) => textSnippet.user)
  textSnippets: TextSnippet[];

  // ---

  public toSanitizedDto(): UserDto {
    return { ...this, password: '' };
  }
}
