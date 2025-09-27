// @ts-ignore
import path from "path";
import loggerUtils from "../../utils/logger.utils";
import StatusCode from "../../utils/statusCode.utils";
import {Token} from "../users/user.entity";
import * as cookie from "cookie";

export default abstract class AbstractController {


    errorResponse(res: ExpressResponse, data: any, code: number = StatusCode.BAD_REQUEST) {
        return res.status(code).json({
            success: false,
            error: data
        })
    }

    successResponse(res: ExpressResponse, data: any, code: number = StatusCode.OK) {
        return res.status(code).json({
            success: true,
            data
        })
    }

    setCookie(req: Request, res: Response, token: Token = null) {
        const payload = {httpOnly: true, path: "/", sameSite: true, secure: process.env.NODE_ENV === "prod"}
        if (token) payload['maxAge'] = req.body.remember_me != undefined ? 30 * 24 * 3600 : 3600
        else payload['expires'] = new Date(0)
        res.set("Set-Cookie", cookie.serialize("token", token, payload));
    }
}