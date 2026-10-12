import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 200 })
  title: string

  @Column({ unique: true, length: 200 })
  slug: string

  @Column({ type: 'text', nullable: true })
  content: string

  @Column({ type: 'text', nullable: true })
  excerpt: string

  @Column({ name: 'cover_url', nullable: true })
  coverUrl: string

  @Column({ nullable: true })
  category: string

  @Column({ name: 'author_id', nullable: true })
  authorId: string

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User

  @Column({ name: 'is_published', default: false })
  isPublished: boolean

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
