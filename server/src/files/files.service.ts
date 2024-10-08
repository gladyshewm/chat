import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class FilesService {
  generateUniqueFilename(filename: string): string {
    const fileExtension = filename.includes('.')
      ? filename.split('.').pop()
      : '';
    const uniquePart = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

    return fileExtension ? `${uniquePart}.${fileExtension}` : uniquePart;
  }

  async readFile(file: FileUpload): Promise<Buffer> {
    const { createReadStream } = file;
    const stream = createReadStream();
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }
}
