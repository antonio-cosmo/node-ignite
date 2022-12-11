
import * as dotenv from 'dotenv'
import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import {compare} from 'bcrypt';
import { sign } from "jsonwebtoken";
import { AppError } from "../../../../shared/AppError";

dotenv.config();

interface IRequest{
    email: string,
    password: string
}

interface IResponse{
    token: string,
    user: {
        name: string,
        email: string
    }
}

const authKeyPublic = process.env.AUTH_KEY_PUBLIC;

@injectable()
class AuthenticateUsecase{
    constructor(@inject('UsersRepository') private usersRepository: IUsersRepository){}

    async execute({email, password}:IRequest){
        const user = await this.usersRepository.findByEmail(email);

        if(!user) throw new AppError('Incorrect email or passeord',400);

        const autheticate = await compare(password, user.password);

        if(!autheticate) throw new AppError('Incorrect email or passeord',400);

        const token = sign({},authKeyPublic,{subject: user.id, expiresIn:'1d'})

        const tokenResponse: IResponse = {
            token,
            user:{
                email: user.email,
                name: user.name
            }
        }

        return tokenResponse;
    }
}

export { AuthenticateUsecase }