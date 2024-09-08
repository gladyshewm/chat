import { Response, Request } from 'express';

export const mockGqlContextRequest = (accessToken?: string) => {
  return {
    accessToken,
  } as unknown as Request;
};

export const mockGqlContextResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn();
  return res as Response;
};
