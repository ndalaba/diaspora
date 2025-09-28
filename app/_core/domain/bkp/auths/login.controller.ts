import AuthService from './auth.service'
import { Request, Response, Router } from 'express'
import AbstractController from '../domain/shared/abstract.controller'
import { validate } from '../domain/shared/validate.middleware'
import { LoginSchema } from '../domain/users/user.schema'

export default class LoginController extends AbstractController {
  constructor(
    private readonly authService: AuthService = new AuthService(),
    private router: Router = Router()
  ) {
    super()
  }

  routes(): Router {
    this.router.get('/login', (_: Request, res: Response) => this.getLogin(_, res))
    this.router.post('/login', validate(LoginSchema), async (req: Request, res: Response) =>
      this.postLogin(req, res)
    )
    this.router.all('/logout', (req: Request, res: Response) => this.logout(req, res))
    return this.router
  }

  private logout(req: Request, res: Response) {
    this.setCookie(req, res, null)
    delete res.locals['user']
    return res.redirect('/auth/login')
  }

  private getLogin(_: Request, res: Response) {
    return res.render('auth/login.twig', { loginDto: { email: '' } })
  }

  private async postLogin(req: Request, res: Response) {
    const response = await this.authService.login(req.body)
    if (response.hasError()) {
      return res.render('auth/login.twig', {
        errors: response.arrayErrors(),
        loginDto: { email: req.body.email }
      })
    }
    this.setCookie(req, res, response.getData('token'))
    return res.redirect('/')
  }
}
