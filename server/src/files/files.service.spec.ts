import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { FileUpload } from 'graphql-upload-ts';
import { Readable } from 'stream';

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

  describe('generateUniqueFilename', () => {
    it('should generate unique filename', () => {
      const filename = 'test.png';
      const result = filesService.generateUniqueFilename(filename);

      expect(result).not.toBe(filename);
    });

    it('should generate unique filename with correct extension', () => {
      const filename = 'test.jpeg';
      const result = filesService.generateUniqueFilename(filename);

      expect(result.split('.').pop()).toBe('jpeg');
    });

    it('should generate unique filename with no extension if not provided', () => {
      const filename = 'test';
      const result = filesService.generateUniqueFilename(filename);

      expect(result).not.toBe(filename);
      expect(result.split('.').pop()).toBe(result);
    });
  });

  describe('readFile', () => {
    it('should read file and return buffer', async () => {
      const mockFileContent = 'Hello, this is a test file content';
      const mockFile = {
        createReadStream: () => Readable.from(Buffer.from(mockFileContent)),
      };

      const result = await filesService.readFile(mockFile as FileUpload);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe(mockFileContent);
    });

    it('should handle empty file', async () => {
      const mockFile = {
        createReadStream: () => Readable.from(Buffer.from('')),
      };

      const result = await filesService.readFile(mockFile as FileUpload);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBe(0);
    });

    it('should handle large file', async () => {
      const mockLargeContent = 'a'.repeat(1024 * 1024); // ~1MB of content
      const mockFile = {
        createReadStream: () => Readable.from(Buffer.from(mockLargeContent)),
      };

      const result = await filesService.readFile(mockFile as FileUpload);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBe(mockLargeContent.length);
      expect(result.toString()).toBe(mockLargeContent);
    });
  });
});
