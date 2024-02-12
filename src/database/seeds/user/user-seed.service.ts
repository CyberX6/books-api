import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async run() {
    await this.repository.save(
      this.repository.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@example.com',
        password: 'secret',
      }),
    );
  }
}
