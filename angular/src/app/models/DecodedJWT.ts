import { UserRole } from "./User";

export interface IToken{
    exp: number,
    iat: number,
    iss: string
    role: UserRole,
};