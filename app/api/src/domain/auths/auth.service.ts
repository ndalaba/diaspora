import * as dayjs from "dayjs"
import * as bcrypt from "bcrypt"
import {tryCatch} from "../utils/functions.utils";
import Response from "../utils/response.utils";
import {generateUid} from "../utils/string.utils";
import * as jwt from "jsonwebtoken";
import {TokenRepository, UserRepository} from "../domain/users/user.repository";
import User, {Token} from "../domain/users/user.entity";
import {CreateUserDto, LoginDto} from "../domain/users/user.schema";


export default class AuthService {
    constructor(private readonly userRepo: UserRepository = new UserRepository(), private readonly tokenRepo: TokenRepository = new TokenRepository()) {
    }

    async updatePassword(password: string, passwordConfirmation: string, token: string): Promise<Response> {
        return tryCatch(async _ => {

            const valid = password.trim().length && (password === passwordConfirmation)

            if (!valid) return new Response().addError('password', "Password and Confirmation don't match.")

            const response = await this.verifyPasswordToken(token)

            let user = response.getData('token').user
            user.password = await bcrypt.hash(user.password, 6)
            user = await this.userRepo.save(user)
            return response.addData("user", user)

        }, token)
    }

    async generateToken(email: string): Promise<Response> {
        return tryCatch(async _ => {
            const user = await this.userRepo.findOneByEmail(email)
            if (!user) return new Response().addError("email", "Email address not found.")

            let token = await this.tokenRepo.findOneByUser(user)

            token.token = generateUid()
            token.expireDate = dayjs().add(24, "hour").toDate()

            token = await this.tokenRepo.save(token)
            user.token = token

            return new Response().addData("user", user)
        }, email)
    }

    async verifyPasswordToken(value: string): Promise<Response> {
        return tryCatch(async _ => {
            const token = await this.tokenRepo.findOneByToken(value)

            if (token === null) return new Response().addError('token', "Invalid Token.")

            if (token.expireDate < new Date()) return new Response().addError("token", "Token expired.")

            return new Response().addData('token', token)
        }, value)
    }

    async verifyToken(value: string): Promise<Response> {
        return tryCatch(async _ => {
            const token = await this.tokenRepo.findOneByToken(value)

            if (token === null) return new Response().addError('token', "Invalid token.")
            if (token.expireDate < new Date()) return new Response().addError("token", "Token expired.")

            const user = token.user as User
            user.active = true
            await this.userRepo.save(user)

            return new Response().addData("user", user)
        }, value)
    }

    async login(dto: LoginDto): Promise<Response> {
        return tryCatch(async _ => {
            const user = await this.userRepo.findOneByEmail(dto.email)

            if (!user || !await bcrypt.compare(dto.password, user.password))
                return new Response().addError('invalid_credential', "Invalid credential.")

            const token = jwt.sign(user.email, process.env.SECRET_KEY)

            user.lastLogin = new Date()
            await this.userRepo.save(user)

            return new Response().addData('token', token).addData('user', user)
        }, dto.email)
    }

    async register(dto: CreateUserDto): Promise<Response> {
        return tryCatch(async _ => {

            const emailExist = async (email: string): Promise<boolean> => await this.userRepo.findOneByEmail(email) instanceof User

            const response = new Response()

            if (await emailExist(dto.email)) return response.addError("email_exist", "Email already used")

            let user = new User(dto)
            user.password = await bcrypt.hash(user.password, 6)

            user = await this.userRepo.save(user) as User

            let token = new Token({token: generateUid(), user, expireDate: dayjs().add(24, "hour").toDate()})
            token = await this.tokenRepo.save(token)
            user.token = token

            return new Response().addData("user", user)

        })
    }
}