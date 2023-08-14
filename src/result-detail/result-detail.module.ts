import { Module } from '@nestjs/common';
import { ResultDetailService } from './result-detail.service';
import { ResultDetailController } from './result-detail.controller';

@Module({
  controllers: [ResultDetailController],
  providers: [ResultDetailService]
})
export class ResultDetailModule {}
