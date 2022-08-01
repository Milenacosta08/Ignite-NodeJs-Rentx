import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserToken } from "../infra/typeorm/entities/UserTokens";

interface IUsersTokenRepository {
    create({ expires_date, user_id, refresh_token }: ICreateUserTokenDTO): Promise<UserToken>;
    findByUserIdAndRefreshToken(user_id: string, token: string): Promise<UserToken>;
    deleteById(id: string): Promise<void>;
}

export { IUsersTokenRepository };