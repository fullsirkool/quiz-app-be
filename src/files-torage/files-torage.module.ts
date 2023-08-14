import { Module } from '@nestjs/common';
import { FilesTorageService } from './files-torage.service';
import { FilesTorageController } from './files-torage.controller';

@Module({
  controllers: [FilesTorageController],
  providers: [FilesTorageService]
})
export class FilesTorageModule {}
