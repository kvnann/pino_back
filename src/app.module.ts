import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestModule } from './request/request.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEntity } from './typeorm/entities/RequestEntity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { Admin } from './typeorm/entities/AdminEntity';
import { AuthMiddleWare } from './middleware/auth.middleware';
import { AuthController } from './auth/auth.controller';
import { AdminModule } from './admin/admin.module';
import { AdminController } from './admin/admin.controller';
import { CommonModule } from './common/common.module';
import { RequestController } from './request/request.controller';
import { Log } from './typeorm/entities/Log';

@Module({
  imports: [
    RequestModule,
    AuthModule,
    AdminModule,
    TokenModule,
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: 5432,
      password: process.env.PG_PASSWORD,
      username: process.env.PG_USERNAME,
      entities: [Admin, RequestEntity, Log],
      database: process.env.PG_DATABASE,
      synchronize: true,
      // logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer
      .apply(AuthMiddleWare)
      .exclude(
        {path:'auth/anonym', method: RequestMethod.GET},
        {path:'admin/login', method: RequestMethod.POST},
        {path:'request', method: RequestMethod.GET},
        {path:'request', method: RequestMethod.POST}
      )
      .forRoutes(AuthController, AdminController, RequestController)

    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes(AuthController, AdminController, RequestController)
  }
}