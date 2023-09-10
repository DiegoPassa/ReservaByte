import { UserRole } from "../models/User";
import { Request, NextFunction, Response } from "express";

const verifyRoles = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!res.locals?.jwtRole) return res.send(403).json({message: 'JWT Role not present'});
        const isAdmin: boolean = res.locals.jwtRole === UserRole.Admin || res.locals.jwtRole === UserRole.Cashier;
        if (!isAdmin){
            const rolesArray: UserRole[] = [...allowedRoles];
            const authorized: boolean = rolesArray.includes(res.locals.jwtRole);
            if (!authorized) return res.send(403).json({message: 'not authorized'});
        }
        next();
    }
}

export default verifyRoles;