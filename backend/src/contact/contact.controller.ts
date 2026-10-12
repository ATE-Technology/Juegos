import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'
import { ContactService } from './contact.service'

class ContactDto {
  @IsString() @MinLength(3) name: string
  @IsEmail() email: string
  @IsString() @MinLength(5) @MaxLength(200) subject: string
  @IsString() @MinLength(20) @MaxLength(2000) message: string
}

@ApiTags('Contacto')
@Controller('contact')
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  send(@Body() dto: ContactDto) {
    return this.service.send(dto)
  }
}
