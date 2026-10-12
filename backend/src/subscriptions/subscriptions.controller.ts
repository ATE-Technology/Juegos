import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { SubscriptionsService } from './subscriptions.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

class RequestPremiumDto {
  @IsEnum(['monthly', 'annual']) plan: 'monthly' | 'annual'
  @IsEnum(['cash', 'nequi', 'transfer']) paymentMethod: string
  @IsOptional() @IsString() notes?: string
}

@ApiTags('Suscripciones')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Get('status')
  getStatus(@Req() req: { user: { sub: string } }) {
    return this.service.getStatus(req.user.sub)
  }

  @Post('request')
  request(@Body() dto: RequestPremiumDto, @Req() req: { user: { sub: string } }) {
    return this.service.requestPremium(req.user.sub, dto)
  }
}
