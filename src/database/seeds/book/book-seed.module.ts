import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookSeedService } from './book-seed.service';
import { Book } from '../../../books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  providers: [BookSeedService],
  exports: [BookSeedService],
})
export class BookSeedModule {}
