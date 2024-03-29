import { Repository } from "typeorm";

import {hash} from 'bcrypt'
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { User } from "../entities/User";
import { ICreateUserDto } from "@modules/accounts/dto/ICreateUserDto";
import { IUpdateUserDto } from "@modules/accounts/dto/IUpdateUserDto";
import { dataSource } from "@shared/infra/typeorm/database/data-source";

export class UsersRepository implements IUsersRepository{
    readonly repository: Repository<User>

    constructor(){
        this.repository = dataSource.getRepository(User)
    }
    async create(userData:ICreateUserDto){

        const userAlreadyExists = await this.findByEmail(userData.email);

        if(userAlreadyExists)  throw new Error("Usuario ja existe");

        const passwordHash = await hash(userData.password, 8);

        const admin = userData.isAdmin || false;
        const createUser = this.repository.create({
            name: userData.name,
            email: userData.email,
            password: passwordHash,
            driver_licenses: userData.driver_licenses,
            isAdmin: admin,
        });

        await this.repository.save(createUser);
    }
    async update(data:IUpdateUserDto){
        await this.repository.update(data.id,{...data})
    }
    async findByEmail(email: string){
        return this.repository.findOne({where:{email}})
    }

    async findAll(){
        return await this.repository.find();
    }

    async findById(id: string){
        const user = await this.repository.findOneBy({id});

        return user;
    }
}