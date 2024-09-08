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
