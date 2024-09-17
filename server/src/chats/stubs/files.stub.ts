import { FileUpload } from 'graphql-upload-ts';

export const fileUploadStub = (filename = 'testFilename'): FileUpload => ({
  filename,
  fieldName: 'testFieldName',
  mimetype: 'image/png',
  encoding: '7bit',
  createReadStream: jest.fn(),
  capacitor: {} as any,
});
