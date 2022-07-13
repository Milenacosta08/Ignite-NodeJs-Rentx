import { ICategoriesRepository } from "../../repositories/ICategoruesRepository";
import { inject, injectable }  from "tsyringe";
import { AppError } from "../../../../errors/AppError";

interface IRequest {
    name: string;
    description: string;
}

@injectable()
class CreateCategoryUseCase {
    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository) {}

    async execute({ name, description }: IRequest): Promise<void> {
        const categotyAlreadyExists = await this.categoriesRepository.findByName(name);

        if (categotyAlreadyExists) {
            throw new AppError('Category already exists');
        }

        this.categoriesRepository.create({ name, description });
    }
}

export { CreateCategoryUseCase };