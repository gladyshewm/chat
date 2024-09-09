import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';

describe('FilesService', () => {
  let filesService: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService],
    }).compile();

    filesService = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(filesService).toBeDefined();
  });
});
