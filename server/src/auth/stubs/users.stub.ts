import { FileObject } from '@supabase/storage-js';

export const fileStub = (name?: string): FileObject => {
  return {
    name: name || 'mock-file',
    bucket_id: 'string',
    owner: 'string',
    id: 'string',
    updated_at: 'string',
    created_at: 'string',
    last_accessed_at: 'string',
    metadata: {
      filename: 'string',
      size: 0,
      path: 'string',
      type: 'string',
    },
    buckets: {
      id: 'string',
      name: 'string',
      owner: 'string',
      created_at: 'string',
      updated_at: 'string',
      public: true,
    },
  };
};
