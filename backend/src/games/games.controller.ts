import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, UseGuards, Req, HttpCode, HttpStatus
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { GamesService } from './games.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

interface AuthRequest {
  user?: { sub: string; role: string }
}

@ApiTags('Juegos')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar juegos (público, oculta URL completa para no-premium)' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('search') search?: string,
    @Req() req?: AuthRequest,
  ) {
    const userRole = req?.user?.role
    return this.gamesService.findAll({ page, limit, category, level, search }, userRole)
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Obtener juego por slug' })
  findOne(@Param('slug') slug: string, @Req() req?: AuthRequest) {
    return this.gamesService.findBySlug(slug, req?.user?.role)
  }

  @Get(':id/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener progreso del usuario en un juego' })
  getProgress(@Param('id') gameId: string, @Req() req: { user: { sub: string } }) {
    return this.gamesService.getProgress(gameId, req.user.sub)
  }

  @Put(':id/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar progreso del usuario en un juego' })
  updateProgress(
    @Param('id') gameId: string,
    @Body() body: { score?: number; levelReached?: number; playTimeSeconds?: number },
    @Req() req: { user: { sub: string } },
  ) {
    return this.gamesService.updateProgress(gameId, req.user.sub, body)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Crear juego' })
  create(@Body() body: Record<string, unknown>) {
    return this.gamesService.create(body)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Actualizar juego' })
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.gamesService.update(id, body)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Eliminar juego' })
  delete(@Param('id') id: string) {
    return this.gamesService.delete(id)
  }
}
