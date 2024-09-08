import { fileStub } from '../stubs/users.stub';
import { UserRepository } from '../../users/users.repository';
import { FileObject } from '@supabase/storage-js';

/* eslint-disable */
export const UserRepositoryMock: jest.Mocked<Partial<UserRepository>> = {
  getUserAvatars: jest.fn(
    (uuid: string): Promise<FileObject[]> =>
      Promise.resolve([fileStub(), fileStub()]),
  ),
  deleteUserProfile: jest.fn((userUuid: string) => Promise.resolve()),
  removeAvatarFromStorage: jest.fn((avatarPath: string) =>
    Promise.resolve(true),
  ),
};
