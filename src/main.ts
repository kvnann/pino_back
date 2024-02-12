import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'

var allowlist = ['http://localhost:3000', 'http://localhost:3001', 'https://pino.az']
var corsOptionsDelegate = function (req:any, callback:any) {
  var corsOptions:any;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptionsDelegate);
  console.log(`Server running on port ${process.env.PORT || 3002}`);
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
