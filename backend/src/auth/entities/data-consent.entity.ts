import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('data_consent')
export class DataConsent {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string

  @Column()
  consented: boolean

  @Column({ name: 'policy_version', default: '1.0' })
  policyVersion: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
