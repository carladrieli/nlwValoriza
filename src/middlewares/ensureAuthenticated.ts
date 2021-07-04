import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {

    // Receber o token
    const authToken = request.headers.authorization;
    const token = authToken.split(" ")[1];

    // Validar se token está preenchido
    if (!token) {
        return response.status(401).end();
    }

    // Validar se o token é válido
    try {
        const { sub }  = verify(token, 'e4bf59c2554e9d9534bd59405d071029') as IPayload;  

    // Recuperar informações do usuário   
        request.user_id = sub;

        return next();

    }catch(err){
        return response.status(401).end();
    }
    
}
