import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 120 })
  name: string

  @Column({ length: 255 })
  email: string

  @Column({ length: 200, nullable: true })
  subject: string

  @Column({ type: 'text' })
  message: string

  @Column({ default: false })
  read: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
