import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { UsersTokenRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokenRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokenInMemory: UsersTokenRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let dateProvider: DayjsDateProvider

describe("Authenticate User", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokenInMemory = new UsersTokenRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory, usersTokenInMemory, dateProvider);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            driver_license: "12345",
            email: "email@test.com",
            password: '123',
            name: "User Test"
        }

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(result).toHaveProperty("token");
    });

    it("should not be able to authenticate an none existent user", async () => {
        await expect(authenticateUserUseCase.execute({
            email: "false@email.com",
            password: "1234"
        })
        ).rejects.toEqual(new AppError("Email or password incorrect"));
    });

    it("should not be able authenticate with incorrect password", async () => {
        const user: ICreateUserDTO = {
            driver_license: "12345",
            email: "user@user.com",
            password: '123',
            name: "User Test Error"
        }

        await createUserUseCase.execute(user);

        await expect(authenticateUserUseCase.execute({
            email: user.email,
            password: "1234"
        })
        ).rejects.toEqual(new AppError("Email or password incorrect"));
    });
});