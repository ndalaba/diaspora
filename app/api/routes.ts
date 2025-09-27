import {Express, Request, Response} from "express";
import AuthController from "../src/auths/auth.controller";
import {authMiddleware} from "../src/auths/auth.middleware";
import CountriesController from "./src/domain/countries/countries.controller";
import SectionsController from "./src/domain/sections/sections.controller";
import AssociationsController, {AssociationMemberController} from "./src/domain/associations/associations.controller";
import ContributionsController from "./src/domain/contributions/contribution/contributions.controller";
import AmountsController from "./src/domain/contributions/amount/amounts.controller";
import SessionsController from "./src/domain/contributions/session/sessions.controller";
import CurrenciesController from "./src/domain/contributions/currency/currencies.controller";
import UsersController from "./src/domain/users/users.controller";
import LoginController from "../src/auths/login.controller";
import RegistrationController from "../src/auths/registration.controller";
import User from "./src/domain/users/user.entity";


export default (app: Express): Express => {

    app.use("/auth", new LoginController().routes());
    app.use("/auth", new RegistrationController().routes());
    app.use("/auth", new AuthController().routes());

    app.use("/api/countries", authMiddleware, new CountriesController().routes());
    app.use("/api/sections", authMiddleware, new SectionsController().routes());
    app.use("/api/associations/members", authMiddleware, new AssociationMemberController().routes());
    app.use("/api/associations", authMiddleware, new AssociationsController().routes());
    app.use("/api/contributions", authMiddleware, new ContributionsController().routes());
    app.use("/api/amounts", authMiddleware, new AmountsController().routes());
    app.use("/api/sessions", authMiddleware, new SessionsController().routes());
    app.use("/api/currencies", authMiddleware, new CurrenciesController().routes());
    app.use("/api/users", authMiddleware, new UsersController().routes());

    app.use("/", authMiddleware, (req: Request, res: Response) => {
        const path = req.protocol + '://' + req.get('host')
        const user: User = res.locals.user;
        return res.render("dashboard.twig", {path, user: user?.toJSON()})
    });

    return app;
}