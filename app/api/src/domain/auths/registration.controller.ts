import AuthService from "./auth.service";
import {Request, Response, Router} from "express";
import AbstractController from "../domain/shared/abstract.controller";
import {validate} from "../domain/shared/validate.middleware";
import {CreateUserDto, CreateUserSchema} from "../domain/users/user.schema";
import User from "../domain/users/user.entity";
import sendEmail from "../utils/email.utils";


export default class RegistrationController extends AbstractController {
    constructor(private readonly authService: AuthService = new AuthService(), private router: Router = Router()) {
        super();
    }

    routes(): Router {

        this.router.get("/registration", (_: Request, res: Response) => this.getRegister(_, res));
        this.router.get("/email-validation", (req: Request, res: Response) => this.emailValidate(req, res));
        this.router.post("/registration", validate(CreateUserSchema), async (req: Request, res: Response) => this.postRegister(req, res));

        return this.router;
    }

    private async emailValidate(req: Request, res: Response) {
        const response = await this.authService.verifyToken(req.query.token as string);
        return res.render("email_validation.twig", {hasError: response.hasError(), errors: response.jsonErrors()});
    }

    private async postRegister(req: Request, res: Response) {
        const response = await this.authService.register(req.body);

        if (response.hasError())
            return res.render("auth/registration.twig", {errors: response.arrayErrors(), user: req.body});
        this.sendEmailValidationToken(response.getData("user"));
        this.setCookie(req, res, response.getData("user").token);
        return res.redirect("/")
    }

    private getRegister(_: Request, res: Response) {
        const user: CreateUserDto = {email: "", firstName: "", lastName: "", user: null,}
        return res.render("auth/registration.twig", {user})
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