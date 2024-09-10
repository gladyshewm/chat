import { Response, Request } from 'express';

export const mockGqlContextRequest = (accessToken?: string) => {
  const req: Partial<Request> = {};
  req.accessToken = accessToken;
  req.headers = {};
  req.cookies = {};
  return req as Request;
};

export const mockGqlContextResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn();
  res.setHeader = jest.fn().mockReturnValue(res);
  return res as Response;
};

export const mockGqlContext = () => {
  const gqlContext = {
    req: mockGqlContextRequest(),
    res: mockGqlContextResponse(),
    user_uuid: '3b8d8290-b7d0-450e-a5ad-2b5b6397aff3',
  };
  return gqlContext;
};
