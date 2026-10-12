import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import type { User } from '../users/entities/user.entity'
import type { Subscription } from '../subscriptions/entities/subscription.entity'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Juegos Educativos <no-reply@juegoseducativos.com>',
        to,
        subject,
        html,
      })
    } catch (error) {
      this.logger.error(`Error enviando email a ${to}: ${error}`)
    }
  }

  async sendPasswordReset(email: string, name: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/restablecer-contrasena?token=${token}`
    await this.send(
      email,
      'Restablece tu contraseña — Juegos Educativos',
      `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#6C63FF">Hola ${name} 👋</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <a href="${url}" style="display:inline-block;background:#6C63FF;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
          Restablecer contraseña
        </a>
        <p style="color:#666;font-size:14px">Este enlace expira en 1 hora. Si no solicitaste esto, ignora este correo.</p>
        <hr style="border:1px solid #eee">
        <p style="color:#999;font-size:12px">Juegos Educativos — Colombia</p>
      </div>
      `
    )
  }

  async sendPremiumRequest(user: User, subscription: Subscription) {
    const planLabel = subscription.plan === 'annual' ? 'Anual' : 'Mensual'
    const methodLabel = { cash: 'Efectivo', nequi: 'Nequi', transfer: 'Transferencia' }[subscription.paymentMethod] ?? subscription.paymentMethod
    await this.send(
      process.env.ADMIN_EMAIL || 'admin@juegoseducativos.com',
      `Nueva solicitud Premium — ${user.fullName}`,
      `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#6C63FF">Nueva solicitud de Premium</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;border:1px solid #eee"><strong>Usuario</strong></td><td style="padding:8px;border:1px solid #eee">${user.fullName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee"><strong>Email</strong></td><td style="padding:8px;border:1px solid #eee">${user.email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee"><strong>Plan</strong></td><td style="padding:8px;border:1px solid #eee">${planLabel}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee"><strong>Método de pago</strong></td><td style="padding:8px;border:1px solid #eee">${methodLabel}</td></tr>
          ${subscription.notes ? `<tr><td style="padding:8px;border:1px solid #eee"><strong>Notas</strong></td><td style="padding:8px;border:1px solid #eee">${subscription.notes}</td></tr>` : ''}
        </table>
        <p style="margin-top:16px">ID de suscripción: <code>${subscription.id}</code></p>
        <p>Accede al <a href="${process.env.FRONTEND_URL}/admin">panel de administración</a> para activar el acceso.</p>
      </div>
      `
    )
  }

  async sendPremiumActivated(user: User, subscription: Subscription) {
    const planLabel = subscription.plan === 'annual' ? 'Anual' : 'Mensual'
    const expiryDate = subscription.expiresAt
      ? new Date(subscription.expiresAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'N/A'

    await this.send(
      user.email,
      '¡Tu acceso Premium está activo! — Juegos Educativos',
      `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#43E97B">¡Bienvenido/a al plan Premium, ${user.fullName}! ⭐</h2>
        <p>Tu suscripción <strong>${planLabel}</strong> está activa y tienes acceso completo a todos los juegos y videos.</p>
        <p>Tu suscripción es válida hasta el <strong>${expiryDate}</strong>.</p>
        <a href="${process.env.FRONTEND_URL}/juegos" style="display:inline-block;background:#6C63FF;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
          Ir a los juegos
        </a>
        <hr style="border:1px solid #eee">
        <p style="color:#999;font-size:12px">Juegos Educativos — Colombia</p>
      </div>
      `
    )
  }

  async sendContactNotification(dto: { name: string; email: string; subject: string; message: string }) {
    await this.send(
      process.env.ADMIN_EMAIL || 'admin@juegoseducativos.com',
      `Nuevo mensaje de contacto: ${dto.subject}`,
      `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#6C63FF">Nuevo mensaje de contacto</h2>
        <p><strong>De:</strong> ${dto.name} (${dto.email})</p>
        <p><strong>Asunto:</strong> ${dto.subject}</p>
        <hr>
        <p>${dto.message.replace(/\n/g, '<br>')}</p>
      </div>
      `
    )
  }
}
