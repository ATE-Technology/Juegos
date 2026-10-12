import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, LessThan } from 'typeorm'
import { Subscription } from './entities/subscription.entity'
import { User } from '../users/entities/user.entity'
import { MailService } from '../mail/mail.service'

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription) private repo: Repository<Subscription>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  async getStatus(userId: string) {
    return this.repo.findOne({
      where: [
        { userId, status: 'active' },
        { userId, status: 'pending' },
      ],
      order: { createdAt: 'DESC' },
    })
  }

  async requestPremium(userId: string, dto: { plan: 'monthly' | 'annual'; paymentMethod: string; notes?: string }) {
    const user = await this.usersRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('Usuario no encontrado')

    const subscription = this.repo.create({
      userId,
      plan: dto.plan,
      status: 'pending',
      paymentMethod: dto.paymentMethod,
      notes: dto.notes,
    })
    await this.repo.save(subscription)

    // Notificar al admin
    await this.mailService.sendPremiumRequest(user, subscription)

    return subscription
  }

  async activate(subscriptionId: string) {
    const sub = await this.repo.findOne({ where: { id: subscriptionId }, relations: ['user'] })
    if (!sub) throw new NotFoundException('Suscripción no encontrada')

    const now = new Date()
    sub.status = 'active'
    sub.startedAt = now

    // Calcular fecha de expiración
    const expires = new Date(now)
    if (sub.plan === 'annual') {
      expires.setFullYear(expires.getFullYear() + 1)
    } else {
      expires.setMonth(expires.getMonth() + 1)
    }
    sub.expiresAt = expires

    await this.repo.save(sub)

    // Actualizar rol del usuario a premium
    await this.usersRepo.update(sub.userId, { role: 'premium' })

    // Enviar confirmación al usuario
    if (sub.user) {
      await this.mailService.sendPremiumActivated(sub.user, sub)
    }

    return sub
  }

  async getPending() {
    return this.repo.find({ where: { status: 'pending' }, relations: ['user'], order: { createdAt: 'ASC' } })
  }

  /** Cron: marcar como expiradas las suscripciones vencidas */
  async expireOld() {
    const expired = await this.repo.find({
      where: { status: 'active', expiresAt: LessThan(new Date()) },
    })

    for (const sub of expired) {
      sub.status = 'expired'
      await this.repo.save(sub)
      await this.usersRepo.update(sub.userId, { role: 'free' })
    }

    return expired.length
  }
}
