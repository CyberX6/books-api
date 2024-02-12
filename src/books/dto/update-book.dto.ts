import { PartialType } from '@nestjs/swagger';
import { ContentDto, CreateBookDto } from './create-book.dto';

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiProperty({ type: String, example: 'Book Title' })
  @IsNotEmpty({ message: 'Title is required.' })
  title: string;

  @ApiProperty({ type: Object, example: [{ id: 1, text: 'Page 1 Text' }] })
  @IsArray({ message: 'Content must be an array.' })
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  content: ContentDto[];

  @ApiProperty({ type: String, example: 'An author' })
  @IsNotEmpty({ message: 'Author is required.' })
  author: string;
}
