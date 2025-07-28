import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
// TODO: Add AuthService and providers

@Module({
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
