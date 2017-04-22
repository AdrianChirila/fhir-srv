import {
    OK, NOT_FOUND, LAST_MODIFIED, NOT_MODIFIED, BAD_REQUEST, ETAG,
    CONFLICT, METHOD_NOT_ALLOWED, NO_CONTENT, CREATED, setIssueRes, jwtConfig
} from '../utils';
import {UserModel as User} from "../models"
import Router = require('koa-router')
import {getLogger} from '../utils';
import * as jwt from "jsonwebtoken"
const log = getLogger('auth');

function createToken(user: any) {
    log(`create token for ${user.username}`);
    return jwt.sign({username: user.pid, _id: user._id}, jwtConfig.secret, { expiresIn: 60*60*60 });
}

export function decodeToken(token: any) {
    let decoded = jwt.decode(token, jwtConfig.secret);
    log(`decoded token for ${decoded}`);
    return decoded;
}

export class AuthRouter extends Router {
    constructor(args: any) {
        super(args);
        this.post('/session', async(ctx: any) => {
            let reqBody = ctx.request.body;
            console.log("Body::", reqBody, ctx.request.headers);
            if (!reqBody.pid || !reqBody.password) {
                log(`session - missing username and password`);
                ctx.body = {message: 'Missing username and password'};
                // setIssueRes(ctx.response, BAD_REQUEST, [{error: 'Both username and password must be set'}])
                return;
            }
            let dbUser = await User.findOne({pid: reqBody.pid, password: reqBody.password});

            if (dbUser && dbUser.password === reqBody.password) {
                ctx.status = CREATED;
                ctx.response.body = {token: createToken(dbUser)};
                log(`session - token created`);
            } else {
                log(`session - wrong password`);
                setIssueRes(ctx.response, BAD_REQUEST, [{error: 'Wrong password'}])
            }
        })
    }
}