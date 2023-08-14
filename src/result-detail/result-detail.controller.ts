import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResultDetailService } from './result-detail.service';
import { CreateResultDetailDto, UpdateResultDetailDto } from './result-detail.dto';

@Controller('result-detail')
export class ResultDetailController {
  constructor(private readonly resultDetailService: ResultDetailService) {}

  @Post()
  create(@Body() createResultDetailDto: CreateResultDetailDto) {
    return this.resultDetailService.create(createResultDetailDto);
  }

  @Get()
  findAll() {
    return this.resultDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultDetailDto: UpdateResultDetailDto) {
    return this.resultDetailService.update(+id, updateResultDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultDetailService.remove(+id);
  }
}
