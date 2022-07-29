import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Craeate Car", () => {

    beforeEach(() => {
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });

    it("should be able create a nnew car", async () => {
        const car = await createCarUseCase.execute({
            name: "Name Car",
            description: "Description Car",
            license_plate: "ABC-1234",
            daily_rate: 100,
            fine_amount: 60,
            brand: "Brand",
            category_id: "category"
        });

        expect(car).toHaveProperty("id");
    });

    it("should not be able create a new car with same license plate", () => {
        expect(async () => {
            await createCarUseCase.execute({
                name: "Car1",
                description: "Description Car",
                license_plate: "ABC-1234",
                daily_rate: 100,
                fine_amount: 60,
                brand: "Brand",
                category_id: "category"
            });

            await createCarUseCase.execute({
                name: "Car2",
                description: "Description Car",
                license_plate: "ABC-1234",
                daily_rate: 100,
                fine_amount: 60,
                brand: "Brand",
                category_id: "category"
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able create a new car with available true by default", async () => {
        const car = await createCarUseCase.execute({
            name: "Car available",
            description: "Description Car",
            license_plate: "ABCD-1234",
            daily_rate: 100,
            fine_amount: 60,
            brand: "Brand",
            category_id: "category"
        });

        expect(car.available).toBe(true);
    });
});