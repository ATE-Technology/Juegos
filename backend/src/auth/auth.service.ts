import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { randomBytes } from 'crypto'
import { User } from '../users/entities/user.entity'
import { DataConsent } from './entities/data-consent.entity'
import { RegisterDto } from './dto/register.dto'
import { MailService } from '../mail/mail.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(DataConsent) private consentRepo: Repository<DataConsent>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  private generateAccessToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' }
    )
  }

  private generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
    )
  }

  async register(dto: RegisterDto, ipAddress?: string) {
    // Verificar si el email ya existe
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } })
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con este correo electrónico')
    }

    // Hash de la contraseña con Argon2id
    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    })

    const user = this.usersRepo.create({
      fullName: dto.fullName,
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      profileType: dto.profileType,
      role: 'free',
    })

    await this.usersRepo.save(user)

    // Registrar consentimiento de datos (Ley 1581/2012)
    const consent = this.consentRepo.create({
      userId: user.id,
      ipAddress,
      consented: dto.consentAccepted,
      policyVersion: '1.0',
    })
    await this.consentRepo.save(consent)

    const accessToken = this.generateAccessToken(user)
    const refreshToken = this.generateRefreshToken(user)

    return { user: this.sanitizeUser(user), accessToken, refreshToken }
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email: email.toLowerCase().trim() } })

    if (!user) {
      // Tiempo constante para evitar timing attacks
      await argon2.hash('dummy_to_prevent_timing_attack')
      throw new UnauthorizedException('Credenciales incorrectas')
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas')
    }

    const accessToken = this.generateAccessToken(user)
    const refreshToken = this.generateRefreshToken(user)

    return { user: this.sanitizeUser(user), accessToken, refreshToken }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      })

      const user = await this.usersRepo.findOne({ where: { id: payload.sub } })
      if (!user) throw new UnauthorizedException()

      const newAccessToken = this.generateAccessToken(user)
      const newRefreshToken = this.generateRefreshToken(user)

      return { user: this.sanitizeUser(user), accessToken: newAccessToken, refreshToken: newRefreshToken }
    } catch {
      throw new UnauthorizedException('Token de refresco inválido o expirado')
    }
  }

  async getMe(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } })
    if (!user) throw new UnauthorizedException()
    return this.sanitizeUser(user)
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepo.findOne({ where: { email: email.toLowerCase().trim() } })

    // Siempre respondemos con éxito para no revelar si el email existe
    if (!user) return

    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

    user.resetPasswordToken = resetToken
    user.resetPasswordExpiry = resetTokenExpiry
    await this.usersRepo.save(user)

    await this.mailService.sendPasswordReset(user.email, user.fullName, resetToken)
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersRepo.findOne({
      where: { resetPasswordToken: token },
    })

    if (!user || !user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
      throw new BadRequestException('El enlace de restablecimiento es inválido o ha expirado')
    }

    user.passwordHash = await argon2.hash(newPassword, { type: argon2.argon2id })
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
    await this.usersRepo.save(user)
  }

  private sanitizeUser(user: User) {
    const { passwordHash, resetPasswordToken, resetPasswordExpiry, ...safe } = user
    void passwordHash; void resetPasswordToken; void resetPasswordExpiry
    return safe
  }
}
