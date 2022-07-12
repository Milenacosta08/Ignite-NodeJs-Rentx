import { SpecificationsRepository } from "../../repositories/implementations/SpecificationsRepository";
import { CreateSpecificationController } from "./CreateSpecificationController";
import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";

const specificationsRepository = new SpecificationsRepository();
const createspecificationUseCase = new CreateSpecificationUseCase(specificationsRepository);
const createSpecificationController = new CreateSpecificationController(createspecificationUseCase);

export { createSpecificationController };