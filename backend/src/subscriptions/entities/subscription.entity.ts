import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'

export type SubscriptionPlan = 'monthly' | 'annual'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending'

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'enum', enum: ['monthly', 'annual'] })
  plan: SubscriptionPlan

  @Column({ type: 'enum', enum: ['active', 'cancelled', 'expired', 'pending'], default: 'pending' })
  status: SubscriptionStatus

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod: string

  @Column({ name: 'payment_ref', nullable: true })
  paymentRef: string

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt: Date

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
