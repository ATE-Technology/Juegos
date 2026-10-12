import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 150 })
  title: string

  @Column({ unique: true, length: 150 })
  slug: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ name: 'embed_url', nullable: true })
  embedUrl: string

  @Column({ name: 'is_premium', default: false })
  isPremium: boolean

  @Column({ nullable: true })
  category: string

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
