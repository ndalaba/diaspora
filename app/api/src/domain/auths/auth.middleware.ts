import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {UserRepository} from "../domain/users/user.repository";
import loggerUtils from "../utils/logger.utils";
import StatusCodeUtils from "../utils/statusCode.utils";
import User, {Role} from "../domain/users/user.entity";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) return next();

        const email: string = jwt.verify(token, process.env.SECRET_KEY!) as string;

        const user = await new UserRepository().findOneByEmail(email);

        if (!user) throw new Error("Unauthenticated");

        res.locals.user = user;

        return next();

    } catch (error) {
        loggerUtils.error(error);
        return res.status(StatusCodeUtils.UNAUTHORIZED).json({error: "Unauthenticated"});
    }
}

export const adminMiddleware = (_: Request, res: Response, next: NextFunction) => {
    try {

        const user: User = res.locals.user;

        if (!user)
            throw new Error("Unauthenticated");

        if (!user.hasAnyRole([Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]))
            throw new Error("Unauthorized");

        return next();

    } catch (error) {
        loggerUtils.error(error);
        return res.status(StatusCodeUtils.UNAUTHORIZED).json({error: "Unauthorized"});
    }
}

