import { UserRole } from "./User";

export interface IToken{
    exp: number,
    iat: number,
    iss: string
    role: UserRole,
    id: string,
};

export class DecodedJWT implements IToken{
    exp: number;
    iat: number;
    iss: string;
    role: UserRole;
    id: string;

    constructor(exp: number, iat: number, iss: string, role: UserRole, id: string){
        this.exp = exp,
        this.iat = iat,
        this.iss = iss,
        this.role = role,
        this.id = id
    }
}