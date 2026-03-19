import bcrypt from "bcrypt";
export const comparePassword = (password: string, hash: string )=>
    bcrypt.compare(password,hash);