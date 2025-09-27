import AuthService from "./auth.service";
import {Request, Response, Router} from "express";
import {authMiddleware} from "./auth.middleware";
import AbstractController from "../domain/shared/abstract.controller";
import StatusCodeUtils from "../utils/statusCode.utils";
import User, {Token} from "../domain/users/user.entity";
import sendEmail from "../utils/email.utils";

import { FastifyInstance } from "fastify";
import { AuthService } from "./auth.service";

export default async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService();

  fastify.post("/register", async (req, reply) => {
    const { email, password } = req.body as { email: string; password: string };
    const user = await authService.register(email, password);
    return { id: user.id, email: user.email };
  });

  fastify.post("/login", async (req, reply) => {
    const { email, password } = req.body as { email: string; password: string };
    const user = await authService.validateUser(email, password);
    if (!user) return reply.status(401).send({ message: "Invalid credentials" });

    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return { token };
  });
}

export default class AuthController extends AbstractController {
    constructor(private readonly authService: AuthService = new AuthService(), private router: Router = Router()) {
        super();
    }

    routes(): Router {

        this.router.post("/update-password", async (req: Request, res: Response) => {
            const {password, passwordConfirmation, token} = req.body;
            const response = await this.authService.updatePassword(password, passwordConfirmation, token);
            if (response.hasError())
                return res.render("recover_password.twig", {
                    hasError: response.hasError(),
                    errors: response.jsonErrors(),
                    token: response.getData("token")
                });
            return res.render("notification.twig", {title: "Password updated", message: "Password updated."});
        });

        this.router.get("/verify-password-token", async (req: Request, res: Response) => {
            const response = await this.authService.verifyPasswordToken(req.query.token as string);
            if (!response.hasError()) return res.render("recover_password.twig", {token: response.getData("token")});
            return res.render("notification.twig", {title: "Invalid Token", message: "Token expired."});
        });

        this.router.post("/recover-password", async (req: Request, res: Response) => {
            const response = await this.authService.generateToken(req.body.email);
            if (response.hasError()) return this.errorResponse(res, response.jsonErrors());
            this.sendResetPasswordToken(response.getData("user"), response.getData("token"));
            return this.successResponse(res, [], StatusCodeUtils.OK);
        });

        this.router.get("/me", authMiddleware, (_: Request, res: Response) => this.successResponse(res, res.locals.user));

        this.router.post("/resend-token", async (req: Request, res: Response) => {
            const response = await this.authService.generateToken(req.body.email);
            if (response.hasError())
                return this.errorResponse(res, response.jsonErrors());
            this.sendEmailValidationToken(response.getData("user"));
            return this.successResponse(res, [], StatusCodeUtils.OK);
        });

        return this.router;
    }

    private sendResetPasswordToken(user: User, token: Token) {
        this.renderFile("email/recover_password.twig", {
                subject: "Password reinitialization",
                url: `${process.env.APP_URL}/api/auth/verify-password-token?token=${token.token}`
            }, (html: string) => sendEmail(user.email, "Password reinitialization", html)
        );
    }

    private sendEmailValidationToken(user: User) {
        this.renderFile("email/email_validation.twig",
            {
                subject: "Email validation",
                url: `${process.env.APP_URL}/api/auth/email-validation?token=${user.token.token}`
            },
            (html: string) => sendEmail(user.email, "Validation email", html)
        );
    }

}