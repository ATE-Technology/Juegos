import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 150 })
  title: string

  @Column({ unique: true, length: 150 })
  slug: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ nullable: true })
  category: string

  @Column({ nullable: true })
  level: string

  @Column({ name: 'cover_url', nullable: true })
  coverUrl: string

  @Column({ name: 'embed_url_demo', nullable: true })
  embedUrlDemo: string

  @Column({ name: 'embed_url_full', nullable: true })
  embedUrlFull: string

  @Column({ name: 'is_premium', default: false })
  isPremium: boolean

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
