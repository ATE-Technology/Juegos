import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export type UserRole = 'free' | 'premium' | 'admin'
export type ProfileType = 'parent' | 'student' | 'teacher'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'full_name', length: 120 })
  fullName: string

  @Column({ unique: true, length: 255 })
  email: string

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string

  @Column({ type: 'enum', enum: ['free', 'premium', 'admin'], default: 'free' })
  role: UserRole

  @Column({ name: 'profile_type', type: 'enum', enum: ['parent', 'student', 'teacher'], nullable: true })
  profileType: ProfileType

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string

  @Column({ name: 'reset_password_token', nullable: true })
  resetPasswordToken: string | undefined

  @Column({ name: 'reset_password_expiry', type: 'timestamptz', nullable: true })
  resetPasswordExpiry: Date | undefined

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
