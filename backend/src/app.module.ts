import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { GamesModule } from './games/games.module'
import { VideosModule } from './videos/videos.module'
import { ArticlesModule } from './articles/articles.module'
import { ContactModule } from './contact/contact.module'
import { SubscriptionsModule } from './subscriptions/subscriptions.module'
import { AdminModule } from './admin/admin.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    // Base de datos PostgreSQL (Supabase)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // Solo en dev
      logging: process.env.NODE_ENV === 'development',
    }),

    // Rate limiting: 100 peticiones por 15 minutos por IP
    ThrottlerModule.forRoot([{
      ttl: 15 * 60 * 1000, // 15 minutos
      limit: 100,
    }]),

    AuthModule,
    UsersModule,
    GamesModule,
    VideosModule,
    ArticlesModule,
    ContactModule,
    SubscriptionsModule,
    AdminModule,
    HealthModule,
  ],
  providers: [
    // Rate limiting global
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
