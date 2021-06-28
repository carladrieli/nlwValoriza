import { FindRelationsNotFoundError, getCustomRepository } from "typeorm"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { UsersRepositories } from "../repositories/UsersRepositories"

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest) {
    const userRepositories = getCustomRepository(UsersRepositories);

    //Verificar se email existe
    const user = await userRepositories.findOne({
      email
    });

    if (!user) {
      throw new Error("Email/Password incorrect")
    }

    //Verificar se senha está correta
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Email/Password incorrect")
    }

    //Gerar token
    const token = sign({
      email: user.email
    }, "77f0ac88fc35e6fc9dc0ec1e91bed325", {
      subject: user.id,
      expiresIn: "1d"
    }
    );

    return token;
  }
}


export { AuthenticateUserService }