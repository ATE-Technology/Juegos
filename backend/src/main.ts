import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Seguridad HTTP headers
  app.use(helmet())

  // Cookie parser (para refresh token HttpOnly)
  app.use(cookieParser())

  // Prefijo global de la API
  app.setGlobalPrefix('api')

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true,         // Convierte tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // Swagger (solo en desarrollo)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Juegos Educativos API')
      .setDescription('API de la plataforma educativa con juegos')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
  }

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`🚀 Backend corriendo en http://localhost:${port}/api`)
  console.log(`📚 Documentación en http://localhost:${port}/api/docs`)
}

bootstrap()
