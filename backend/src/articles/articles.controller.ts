import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ArticlesService } from './articles.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('Artículos')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly service: ArticlesService) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('category') category?: string) {
    return this.service.findAll({ page, limit, category })
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) { return this.service.findBySlug(slug) }

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
