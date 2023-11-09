import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import asyncHandler from "../middleware/async";
import ErrorResponse from "../util/errorResponse";

export interface TokenPayload extends JwtPayload {
  id: string;
  accesos?: string[];
}

export const auth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");

    if (!authHeader) throw new ErrorResponse("No token found", 401);

    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_PASSWORD!);
    } catch (err) {
      throw new ErrorResponse("Invalid token", 401);
    }

    if (!decodedToken) throw new ErrorResponse("Invalid token", 401);

    const { id, accesos } = decodedToken as TokenPayload;

    req.user = { id, accesos };

    next();
  }
);

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) 
      throw new ErrorResponse("No user found", 401);
    
    if (!req.user.accesos) 
      throw new ErrorResponse("No access found", 401);
    
    
    for (const role of roles) {
      if (req.user.accesos.includes(role)) {
        return next();
      }
    }
    
    throw new ErrorResponse("User not authorized", 401);

  };
};
