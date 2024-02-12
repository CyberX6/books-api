import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ContentDto {
  @IsNumber({}, { message: 'Id must be a number.' })
  id: number;

  @IsString({ message: 'Text must be a string.' })
  text: string;
}

export class CreateBookDto {
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
