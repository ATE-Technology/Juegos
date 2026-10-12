import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminController } from './admin.controller'
import { User } from '../users/entities/user.entity'
import { Game } from '../games/entities/game.entity'
import { SubscriptionsModule } from '../subscriptions/subscriptions.module'

@Module({
  imports: [TypeOrmModule.forFeature([User, Game]), SubscriptionsModule],
  controllers: [AdminController],
})
export class AdminModule {}
