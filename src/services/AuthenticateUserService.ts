import { getCustomRepository } from "typeorm";
import { compare } from "bcryptjs";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { sign } from "jsonwebtoken"

interface IAuthenticateRequest {
    email: string;
    password: string

}

class AuthenticateUserService {
    async execute({ email, password }: IAuthenticateRequest) {

        const usersRepositories = getCustomRepository(UsersRepositories);

        // verifica se usuário existe
        const user = await usersRepositories.findOne({ email });

        if (!user) {
            throw new Error("Email/Password incorrect");
        }

        // Verifica se senha está correta
        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error("Email/Password incorrect");
        }

        const token = sign({
            email: user.email
        }, "e4bf59c2554e9d9534bd59405d071029", {
            subject: user.id,
            expiresIn: "1d"
        })

        return token;
    }
}

export { AuthenticateUserService }