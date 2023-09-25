/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { AuthMiddleware } from './middleware/auth.middleware';
import { FileUploadMiddleware } from './middleware/user.upload';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest-js'),
    UserModule
  ], // Include the UserModule
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'product', method: RequestMethod.ALL },
    );
    consumer.apply(FileUploadMiddleware).forRoutes('*');


    // consumer.apply(FileUploadMiddleware).forRoutes(
    //   { path: 'user/register', method: RequestMethod.POST },
    // );
  }

}
