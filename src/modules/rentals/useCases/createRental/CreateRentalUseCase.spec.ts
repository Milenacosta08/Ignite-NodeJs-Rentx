import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";
import dayjs from "dayjs";
import { CreateRentalUseCase } from "./CreateRentaluseCase";

let createRentalUserCase: CreateRentalUseCase;
let rentalRepositoryInMemory: RentalRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
    const dayAdd24hours = dayjs().add(1, 'day').toDate();

    beforeEach(() => {
        rentalRepositoryInMemory = new RentalRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        dayjsDateProvider = new DayjsDateProvider();
        createRentalUserCase = new CreateRentalUseCase(rentalRepositoryInMemory, dayjsDateProvider, carsRepositoryInMemory);
    })

    it("should be able to create a new rental", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Test",
            description: "Car Test",
            daily_rate: 100,
            license_plate: "AAA-1111",
            fine_amount: 40,
            category_id: "1234",
            brand: "brand"
        });

        const rental = await createRentalUserCase.execute({
            user_id: "user-id",
            car_id: car.id,
            expected_return_date: dayAdd24hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        await rentalRepositoryInMemory.create({
            car_id: "id_car",
            expected_return_date: dayAdd24hours,
            user_id: "1234",
        });

        await expect(createRentalUserCase.execute({
            user_id: "1234",
            car_id: "car-id",
            expected_return_date: dayAdd24hours,
        })
        ).rejects.toEqual(new AppError("There is a rental in progress for user"));
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        await rentalRepositoryInMemory.create({
            car_id: "test",
            expected_return_date: dayAdd24hours,
            user_id: "1234",
        });

        await expect(createRentalUserCase.execute({
            user_id: "id-user",
            car_id: "test",
            expected_return_date: dayAdd24hours,
        })
        ).rejects.toEqual(new AppError("Car is unavailable"));
    });

    it("should not be able to create a new rental if with invalid return time", async () => {
        await expect(createRentalUserCase.execute({
            user_id: "user-id",
            car_id: "car-id",
            expected_return_date: dayjs().toDate(),
        })
        ).rejects.toEqual(new AppError("Invalid return time"));
    });
});