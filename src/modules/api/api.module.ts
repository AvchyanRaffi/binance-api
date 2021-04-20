import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { UserSchema } from './schemas/user.schema';
import { AlertsSchema } from './schemas/alerts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Alerts', schema: AlertsSchema },
      ]),
    ],
  controllers: [ApiController],
  exports: [ApiService],
  providers: [ApiService],
})
export class ApiModule {}
