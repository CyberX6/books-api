import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../../../books/entities/book.entity';

@Injectable()
export class BookSeedService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async run() {
    const books = [
      {
        title: 'The Little Prince',
        author: 'Antoine de Saint-Exupéry',
        content: this.generateContent('The Little Prince', 5),
      },
      {
        title: 'Animal Farm',
        author: 'George Orwell',
        content: this.generateContent('Animal Farm', 5),
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        content: this.generateContent('To Kill a Mockingbird', 5),
      },
    ];

    await Promise.all(
      books.map(async (book) => {
        await this.bookRepository.save(book);
      }),
    );
  }

  private generateContent(title: string, pageCount: number): any[] {
    return Array.from({ length: pageCount }, (_, i) => ({
      id: i + 1,
      text: `Content of ${title}, Page ${i + 1}`,
    }));
  }
}
