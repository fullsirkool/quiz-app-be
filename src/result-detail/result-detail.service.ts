import { Injectable } from '@nestjs/common';
import { CreateResultDetailDto, UpdateResultDetailDto } from './result-detail.dto';

@Injectable()
export class ResultDetailService {
  create(createResultDetailDto: CreateResultDetailDto) {
    return 'This action adds a new resultDetail';
  }

  findAll() {
    return `This action returns all resultDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resultDetail`;
  }

  update(id: number, updateResultDetailDto: UpdateResultDetailDto) {
    return `This action updates a #${id} resultDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} resultDetail`;
  }
}
