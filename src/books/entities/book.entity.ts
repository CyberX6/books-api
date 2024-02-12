import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Book extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  @IsNotEmpty()
  title: string;

  @Column('jsonb')
  @IsNotEmpty()
  content: object[];

  @Column({ type: Number, default: 0 })
  lastReadPage: number;

  @Index()
  @Column({ type: String })
  @IsNotEmpty()
  author: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
