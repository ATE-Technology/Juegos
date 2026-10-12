import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ContactMessage } from './entities/contact-message.entity'
import { MailService } from '../mail/mail.service'

export class ContactDto {
  name: string
  email: string
  subject: string
  message: string
}

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage) private repo: Repository<ContactMessage>,
    private mailService: MailService,
  ) {}

  async send(dto: ContactDto) {
    const msg = this.repo.create(dto)
    await this.repo.save(msg)
    // Notificar al administrador
    await this.mailService.sendContactNotification(dto)
    return { message: 'Mensaje enviado correctamente' }
  }
}
