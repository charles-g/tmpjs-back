import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { GetRelevantCompanies } from './search/get-revelant-companies.use-case';
import { PrismaService } from "./misc/app.prisma-service";
import { Repository } from "./search/repository";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [GetRelevantCompanies, PrismaService, Repository],
})
export class AppModule {}
