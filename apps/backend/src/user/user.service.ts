import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class UserService {
  private readonly subscribers: { [key: number]: (user: User) => void } = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Timeout(1000)
  async onStartup(): Promise<void> {
    // check if we have at least one (admin) user, else create one
    if ((await this.findAll()).length === 0) {
      const userToCreate: CreateUserDto = {
        username: 'admin',
        password: 'admin',
        email: 'admin@example.com',
        isAdmin: true,
      };
      this.create(userToCreate);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOneByUsername(createUserDto.username);
    if (existingUser) {
      throw new BadRequestException('username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUserDto = {
      ...createUserDto,
      password: hashedPassword,
      numReviewItemsToSend: 6,
      reviewFreqAndTime: '0 0 8 * * *',
    };
    const userData = await this.userRepository.create(newUserDto);
    return this.userRepository.save(userData);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const userData = await this.userRepository.findOneBy({ id });
    if (!userData) {
      throw new HttpException('User Not Found', 404);
    }
    return userData;
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const userData = await this.userRepository.findOneBy({
      username: username,
    });
    return userData;
  }

  async findAllAdmins(): Promise<User[]> {
    const userData = await this.userRepository.findBy({ isAdmin: true });
    return userData;
  }

  async findOneByUsernameChecked(username: string): Promise<User> {
    const userData = await this.findOneByUsername(username);
    if (!userData) {
      throw new HttpException('User Not Found', 404);
    }
    return userData;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOne(id);

    let newUpdateUserDto = updateUserDto;
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      newUpdateUserDto = {
        ...updateUserDto,
        password: hashedPassword,
      };
    }

    const userData = this.userRepository.merge(existingUser, newUpdateUserDto);
    const updatedUser = await this.userRepository.save(userData);

    const cb = this.subscribers[updatedUser.id];
    if (cb !== undefined) {
      cb(updatedUser);
    }

    return updatedUser;
  }

  async remove(id: number): Promise<User> {
    const existingUser = await this.findOne(id);
    return await this.userRepository.remove(existingUser);
  }

  addSubscriber(user: User, cb: (user: User) => void): void {
    this.subscribers[user.id] = cb;
  }
}
