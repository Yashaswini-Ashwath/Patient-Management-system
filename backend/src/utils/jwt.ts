// jsonwebtoken is a library to create and verify JWTs (JSON Web Tokens).

import jwt from "jsonwebtoken";

export const signToken = (doctorId: number) => {
    return jwt.sign({doctorId }, "SECRET_KEY", { expiresIn: "1d"}) 
}