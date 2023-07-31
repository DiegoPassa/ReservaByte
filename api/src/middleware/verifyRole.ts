import { UserRole } from "../models/User";
import { Request, NextFunction, Response } from "express";

// const verifyRoles = (...allowedRoles: UserRole[]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!res.locals?.jwtRoles) return res.sendStatus(401);
//         const isAdmin: boolean = res.locals.jwtRoles.includes(UserRole.Admin, UserRole.Cashier);
//         if (!isAdmin){
//             const rolesArray:UserRole[] = [...allowedRoles];
//             const authorized:boolean = res.locals.jwtRoles.map((role: UserRole) => rolesArray.includes(role)).find((val:Boolean) => val === true);
//             if (!authorized) return res.sendStatus(401);
//         }
//         next();
//     }
// }

const verifyRoles = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!res.locals?.jwtRole) return res.sendStatus(401);
        const isAdmin: boolean = res.locals.jwtRole === UserRole.Admin || res.locals.jwtRole === UserRole.Cashier;
        if (!isAdmin){
            const rolesArray: UserRole[] = [...allowedRoles];
            const authorized: boolean = rolesArray.includes(res.locals.jwtRole);
            // const authorized:boolean = res.locals.jwtRoles.map((role: UserRole) => rolesArray.includes(role)).find((val:Boolean) => val === true);
            if (!authorized) return res.sendStatus(401);
        }
        next();
    }
}

export default verifyRoles;