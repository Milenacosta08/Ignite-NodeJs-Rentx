import { getRepository, Repository } from "typeorm";
import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { UserToken } from "../entities/UserTokens";

class UsersTokenRepository implements IUsersTokenRepository {
    private repository: Repository<UserToken>

    constructor() {
        this.repository = getRepository(UserToken);
    }

    async create({ expires_date, user_id, refresh_token }: ICreateUserTokenDTO): Promise<UserToken> {
        const userToken = this.repository.create({
            expires_date,
            user_id,
            refresh_token
        });

        await this.repository.save(userToken);

        return userToken;
    }

    async findByUserIdAndRefreshToken(user_id: string, refresh_token): Promise<UserToken> {
        const userTokens = await this.repository.findOne({
            user_id,
            refresh_token
        });

        return userTokens;
    }

    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}

export { UsersTokenRepository };