import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UsersTokenRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokenRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepository;
let dateProvider: DayjsDateProvider;
let usersTokenRepositoryInMemory: UsersTokenRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Mail", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepository();
        dateProvider = new DayjsDateProvider();
        usersTokenRepositoryInMemory = new UsersTokenRepositoryInMemory();
        mailProvider = new MailProviderInMemory();
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokenRepositoryInMemory,
            dateProvider,
            mailProvider
        );
    });

    it("should be able to send a forgot password mail to user", async () => {
        const sendMail = spyOn(mailProvider, "sendMail");

        await usersRepositoryInMemory.create({
            driver_license: "283608",
            email: "irje@tobawki.io",
            name: "John Parsons",
            password: "1234"
        });

        await sendForgotPasswordMailUseCase.execute("irje@tobawki.io");

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to send an email if user does not exists", async () => {
        await expect(
            sendForgotPasswordMailUseCase.execute("mil@gmail.com")
        ).rejects.toEqual(new AppError("User does not exists"));
    });

    it("should be able to create an users token", async () => {
        const generateTokenMail = spyOn(usersTokenRepositoryInMemory, "create");

        usersRepositoryInMemory.create({
            driver_license: "123456",
            email: "irje@thehehei.io",
            name: "John Carson",
            password: "1234"
        });

        await sendForgotPasswordMailUseCase.execute("irje@thehehei.io");

        expect(generateTokenMail).toBeCalled();
    })
});