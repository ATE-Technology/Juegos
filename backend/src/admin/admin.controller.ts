import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import { Game } from '../games/entities/game.entity'
import { SubscriptionsService } from '../subscriptions/subscriptions.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Game) private gamesRepo: Repository<Game>,
    private subscriptionsService: SubscriptionsService,
  ) {}

  @Get('stats')
  async getStats() {
    const [totalUsers, totalGames, activeSubscriptions, pendingRequests] = await Promise.all([
      this.usersRepo.count(),
      this.gamesRepo.count({ where: { isActive: true } }),
      this.usersRepo.count({ where: { role: 'premium' } }),
      this.subscriptionsService.getPending().then(r => r.length),
    ])
    return { totalUsers, totalGames, activeSubscriptions, pendingRequests }
  }

  @Get('users')
  async getUsers() {
    const users = await this.usersRepo.find({ order: { createdAt: 'DESC' }, take: 100 })
    const total = await this.usersRepo.count()
    return { data: users.map(u => { const { passwordHash, resetPasswordToken, resetPasswordExpiry, ...safe } = u; void passwordHash; void resetPasswordToken; void resetPasswordExpiry; return safe }), total }
  }

  @Put('users/:id/role')
  async updateRole(@Param('id') id: string, @Body() body: { role: 'free' | 'premium' | 'admin' }) {
    await this.usersRepo.update(id, { role: body.role })
    return { message: 'Rol actualizado' }
  }

  @Get('subscriptions/pending')
  getPending() {
    return this.subscriptionsService.getPending()
  }

  @Put('subscriptions/:id/activate')
  activate(@Param('id') id: string) {
    return this.subscriptionsService.activate(id)
  }
}
