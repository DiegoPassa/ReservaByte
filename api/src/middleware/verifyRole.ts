import { Request } from "express-jwt";
import { UserRole } from "../models/User";
import { NextFunction, Response } from "express";

const verifyRoles = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!res.locals?.jwtRoles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = res.locals.jwtRoles.map((role:UserRole) => rolesArray.includes(role)).find((val:Boolean) => val === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}

export default verifyRoles;