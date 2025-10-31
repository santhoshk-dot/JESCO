import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './address/address.module';
import { OrdersModule } from './order/order.module';
import  config  from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache:true,
      isGlobal: true,
      load:[config]
    }),
    JwtModule.registerAsync({ 
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
      }),
      global:true,
      inject: [ConfigService]
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connectionString'),
      }),
      inject: [ConfigService]
    }), 
    AuthModule,
    RolesModule,
    UsersModule,
    AddressesModule,
    OrdersModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
