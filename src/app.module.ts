/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { AuthMiddleware } from './middleware/auth.middleware';
import { FileUploadMiddleware } from './middleware/user.upload';
import { CompanyModule } from './Company/company.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://root:root@cluster0.irsxteg.mongodb.net/nest-js'),
    UserModule,
    CompanyModule,
  ], // Include the UserModule
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'user/profile', method: RequestMethod.GET },
    );
     consumer.apply(FileUploadMiddleware).forRoutes('user/register');


    // consumer.apply(FileUploadMiddleware).forRoutes(
    //   { path: 'user/register', method: RequestMethod.POST },
    // );
  }

}
