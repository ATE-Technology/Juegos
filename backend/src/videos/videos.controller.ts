import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { VideosService } from './videos.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('Videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly service: VideosService) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('category') category?: string, @Req() req?: { user?: { role: string } }) {
    return this.service.findAll({ page, limit, category }, req?.user?.role)
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Req() req?: { user?: { role: string } }) {
    return this.service.findBySlug(slug, req?.user?.role)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  create(@Body() body: Record<string, unknown>) { return this.service.create(body) }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) { return this.service.update(id, body) }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) { return this.service.delete(id) }
}
