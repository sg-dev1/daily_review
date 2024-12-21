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

  // ---
  // Relations

  @OneToMany(() => TextSnippet, (textSnippet) => textSnippet.user)
  textSnippets: TextSnippet[];

  // ---

  public toSanitizedDto(): UserDto {
    return { ...this, password: '' };
  }
}
