import { ISpecificationRepository } from "../../repositories/ISpecificationsRepository";

interface IRequest {
    name: string;
    description: string;
}

class CreateSpecificationUseCase {
    constructor(private specificcationsRepository: ISpecificationRepository) {}

    execute({ name, description }: IRequest): void  {
        const specificationAlreadyExists = this.specificcationsRepository.findByName(name);

        if (specificationAlreadyExists) {
            throw new Error("Specification already exists");
        }
        
        this.specificcationsRepository.create({ name, description });
    }
}

export { CreateSpecificationUseCase };