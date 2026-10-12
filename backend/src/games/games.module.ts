import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GamesController } from './games.controller'
import { GamesService } from './games.service'
import { Game } from './entities/game.entity'
import { GameProgress } from './entities/game-progress.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Game, GameProgress])],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
