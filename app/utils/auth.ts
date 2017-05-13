import * as jwt from "jsonwebtoken"
import {getLogger} from "./index";
const log = getLogger('auth');
const jwtConfig = {
    secret: 'my-secret'
};

export function createToken(user: any) {
    log(`create token for ${user.username}`);
    return jwt.sign({username: user.pid, _id: user._id}, jwtConfig.secret, { expiresIn: 60*60*60 });
}

export function decodeToken(token: any) {
    let decoded = jwt.decode(token, jwtConfig.secret);
    log(`decoded token for ${decoded}`);
    return decoded;
}

export function verifyToken(ctx: any) {
    console.log('Verify token:::', ctx.request.headers.authorization);
    let data: any = jwt.verify(ctx.request.headers.authorization, jwtConfig.secret);
    console.log('TOken valid!', data);
    ctx.state.username = data.username;
    ctx.state._id = data._id;
}
/*
 (ctx: any, next: any) => {
 console.log('Ver token!', ctx.request.headers);
 verifyToken(ctx.request.headers.authorization)
 return next();
 }
 */
export function secure() {
    return (ctx: any, next: any) => {
        let decodeData: any = verifyToken(ctx);
        return next();
    }
}