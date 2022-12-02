import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IRequest } from "./CreateUsersController";
@injectable()
export class CreateUsersUseCase{
    constructor(@inject('UsersRepository') private usersRepository: IUsersRepository){}

    async execute({name, email, password, driver_licenses}:IRequest){
        
        return await this.usersRepository.create({name, email, password, driver_licenses});
        
    }
}