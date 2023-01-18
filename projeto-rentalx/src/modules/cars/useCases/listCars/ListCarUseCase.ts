import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class ListCarUseCase{
  constructor(@inject('CarsRepository') private carsRepository: ICarsRepository){};

  async execute(){
    const car = await this.carsRepository.all();

    return car;
  }
}