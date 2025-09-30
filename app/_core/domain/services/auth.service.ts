import { UserRepository, TokenRepository } from '../repositories/UserRepository'
import User, { Token } from '../entities/User'
import bcrypt from 'bcrypt'
import { CreateUserDto, CreateUserSchema, LoginDto, LoginSchema } from '../dtos/userDto'
import dayjs from 'dayjs'
import { generateUid } from '../../utils/string.utils'
import jwt from 'jsonwebtoken'

export default class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenRepo: TokenRepository
  ) {}

  async loginUser(dto: LoginDto): Promise<{ user: User; token: string }> {
    const parsed = LoginSchema.safeParse(dto)

    if (!parsed.success) throw new Error(parsed.error.message)

    const user = await this.userRepo.findOneByEmail(dto.email)

    if (!user || !(await bcrypt.compare(dto.password, user.password!)))
      throw new Error('Invalid credential')

    const token = jwt.sign(user.email, process.env.SECRET_KEY ?? '')

    user.lastLogin = new Date()
    await this.userRepo.save(user)

    return { user, token }
  }

  async registerUser(dto: CreateUserDto): Promise<User> {
    const parsed = CreateUserSchema.safeParse(dto)

    if (!parsed.success) throw new Error(parsed.error.message)

    const existing = await this.userRepo.findOneByEmail(dto.email)

    if (existing) throw new Error(`Email already used ${dto.email}`)

    let user = new User(dto)
    user.password = await bcrypt.hash(user.password!, 6)

    user = await this.userRepo.save(user)

    let token = new Token({
      token: generateUid(),
      user,
      expireDate: dayjs().add(24, 'hour').toDate()
    })
    token = await this.tokenRepo.save(token)
    user.token = token

    return user
  }

  async verifyToken(value: string): Promise<{ user: User; token: Token }> {
    const token = await this.tokenRepo.findOneByToken(value)
    if (!token) throw new Error('Token not found')

    if (token.expireDate < new Date()) throw new Error('Token expired')

    const user = token.user as User
    user.active = true
    await this.userRepo.save(user)

    return { user, token }
  }

  async updatePassword(
    password: string,
    passwordConfirmation: string,
    token: string
  ): Promise<User> {
    const valid = password.trim().length && password === passwordConfirmation

    if (!valid) throw new Error('Invalid password')

    const existingToken = await this.tokenRepo.findOneByToken(token)

    if (existingToken === null) throw new Error('Invalid token')

    if (existingToken.expireDate < new Date()) throw new Error('Token expired')

    let user = existingToken.user as User
    user.password = await bcrypt.hash(password, 6)
    user = await this.userRepo.save(user)
    return user
  }

  async generateToken(email: string): Promise<{ user: User; token: Token }> {
    const user = await this.userRepo.findOneByEmail(email)

    if (!user) throw new Error('User not found')

    let token = await this.tokenRepo.findOneByUser(user)

    token.token = generateUid()
    token.expireDate = dayjs().add(24, 'hour').toDate()

    token = await this.tokenRepo.save(token)
    user.token = token

    await this.userRepo.save(user)

    return { user, token }
  }
}
