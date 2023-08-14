import { Controller } from '@nestjs/common';
import { FilesTorageService } from './files-torage.service';

@Controller('files-torage')
export class FilesTorageController {
  constructor(private readonly filesTorageService: FilesTorageService) {}
}
