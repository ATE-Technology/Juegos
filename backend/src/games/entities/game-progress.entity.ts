import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, Unique } from 'typeorm'

@Entity('game_progress')
@Unique(['userId', 'gameId'])
export class GameProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'game_id' })
  gameId: string

  @Column({ default: 0 })
  score: number

  @Column({ name: 'level_reached', default: 0 })
  levelReached: number

  @Column({ name: 'play_time_s', default: 0 })
  playTimeSeconds: number

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
