import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserToken } from "@modules/accounts/infra/typeorm/entities/UserTokens";
import { IUsersTokenRepository } from "../IUsersTokenRepository";

class UsersTokenRepositoryInMemory implements IUsersTokenRepository {
    usersTokens: UserToken[] = [];

    async create({ expires_date, user_id, refresh_token }: ICreateUserTokenDTO): Promise<UserToken> {
        const userToken = new UserToken();

        Object.assign(userToken, {
            expires_date,
            refresh_token,
            user_id
        });

        this.usersTokens.push(userToken);

        return userToken;
    }

    async findByUserIdAndRefreshToken(user_id: string, token: string): Promise<UserToken> {
        const userToken = this.usersTokens.find(ut => ut.user_id === user_id && ut.refresh_token === token);

        return userToken;
    }

    async deleteById(id: string): Promise<void> {
        const userToken = this.usersTokens.find(ut => ut.id === id);
        this.usersTokens.splice(
            this.usersTokens.indexOf(userToken),
        );
    }

    async findByRefreshToken(refresh_token: string): Promise<UserToken> {
        return this.usersTokens.find(ut => ut.refresh_token === refresh_token);
    }

}

export { UsersTokenRepositoryInMemory };