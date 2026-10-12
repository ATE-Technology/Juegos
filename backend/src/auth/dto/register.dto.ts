import { IsEmail, IsString, MinLength, MaxLength, IsEnum, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum ProfileType {
  PARENT = 'parent',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export class RegisterDto {
  @ApiProperty({ example: 'María García' })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  fullName: string

  @ApiProperty({ example: 'maria@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string

  @ApiProperty({ enum: ProfileType })
  @IsEnum(ProfileType)
  profileType: ProfileType

  @ApiProperty()
  @IsBoolean()
  consentAccepted: boolean
}
