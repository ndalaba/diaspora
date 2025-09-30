import { FilterUserDto } from "../../application/dtos/userDto"
import User, { Token } from "../entities/User"
import CommonRepository from "./CommonRepository"

export interface UserRepository extends CommonRepository<User> {
    findOneByEmail(email: string): Promise<User>
    filter(dto: FilterUserDto): Promise<User[]>
}

export interface TokenRepository {
    save(token: Token): Promise<Token>
    findOneByToken(token: string): Promise<Token>
    findOneByUser(user: User): Promise<Token>
}