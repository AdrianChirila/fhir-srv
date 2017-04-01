import {
    OK, NOT_FOUND, LAST_MODIFIED, NOT_MODIFIED, BAD_REQUEST, ETAG,
    CONFLICT, METHOD_NOT_ALLOWED, NO_CONTENT, CREATED, setIssueRes, jwtConfig
} from '../utils';
import Router = require('koa-router')
import {getLogger} from '../utils';
import * as jwt from "jsonwebtoken"
const log = getLogger('auth');

function createToken(user: any) {
    log(`create token for ${user.username}`);
    return jwt.sign({username: user.username, _id: user._id}, jwtConfig.secret, { expiresIn: 60*60*60 });
}

export function decodeToken(token: any) {
    let decoded = jwt.decode(token, jwtConfig.secret);
    log(`decoded token for ${decoded}`);
    return decoded;
}

export class AuthRouter extends Router {
    constructor(args: any) {
        super(args);
        // this.userStore = args.userStore;
        // this.post('/signin', async(ctx: any, next: any) => {
        //     // let user = await this.userStore.insert(ctx.request.body);
        //     ctx.response.body = {token: createToken(user)};
        //     ctx.status = CREATED
        //     log(`signup - user ${user.username} created`);
        // });

        this.post('/session', async(ctx: any) => {
            console.log('On auth:::', ctx);
            ctx.body = {message: "gata!"};
            let reqBody = ctx.request.body;
            if (!reqBody.username || !reqBody.password) {
                log(`session - missing username and password`);
                setIssueRes(ctx.response, BAD_REQUEST, [{error: 'Both username and password must be set'}])
                return;
            }
            let user = {cnp: "cnp", password: "pass"};
            // let user = await this.userStore.findOne({username: reqBody.username})
            if (user && user.password === reqBody.password) {
                ctx.status = CREATED;
                ctx.response.body = {token: createToken(user)};
                log(`session - token created`);
            } else {
                log(`session - wrong password`);
                setIssueRes(ctx.response, BAD_REQUEST, [{error: 'Wrong password'}])
            }
        })
    }
}