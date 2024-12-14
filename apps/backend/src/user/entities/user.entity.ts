import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //@Column()
  //fullName: string;

  @Column({ unique: true })
  email: string;

  @Index({
    unique: true,
  })
  @Column()
  username: string;

  // password also includes the salt, see https://www.npmjs.com/package/bcrypt
  @Column()
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  public toSanitized(): UserEntity {
    return { ...this, password: '' };
  }
}
