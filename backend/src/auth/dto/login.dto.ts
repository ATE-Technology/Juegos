import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'maria@example.com' })
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  password: string
}
