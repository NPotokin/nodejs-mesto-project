import { NextFunction, Request, Response } from 'express';

const tempOwner = (_req: Request, res:Response, next: NextFunction) => {
  res.locals.user = {
    _id: '67e79e96adb7c31d257db971',
  };

  next();
};

export default tempOwner;
