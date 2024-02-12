import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './entities/book.entity';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { User } from '../users/entities/user.entity';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto): Promise<Book> {
    return this.booksRepository.save(
      this.booksRepository.create(createBookDto),
    );
  }

  findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Book[]> {
    return this.booksRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<User>): Promise<NullableType<Book>> {
    return this.booksRepository.findOne({
      where: fields,
    });
  }

  update(id: User['id'], payload: DeepPartial<Book>): Promise<Book> {
    return this.booksRepository.save(
      this.booksRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.booksRepository.softDelete(id);
  }
}
