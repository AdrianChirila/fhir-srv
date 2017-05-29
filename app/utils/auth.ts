import * as jwt from "jsonwebtoken"
import {getLogger} from "./index";
import {UserModel} from "../models/user.model";
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

export async function verifyToken(ctx: any) {
    return jwt.verify(ctx.request.headers.authorization, jwtConfig.secret);

}

async function ensureDateInState(ctx: any, data: any) {
    ctx.state.username = data.username;
    ctx.state._id = data._id;
    //check if user is Practitioner or Patient.
    let targetUser: any = await UserModel.findById(data._id);
    console.log('User id:', targetUser._id);
    if (targetUser.activity.actor.practitioner)
        ctx.state.practitioner = targetUser.activity.actor.practitioner;
    else
        ctx.state.patient = targetUser.activity.actor.patient;
}

export function secure() {
    return async(ctx: any, next: any) => {
        let data: any = await verifyToken(ctx);
        await ensureDateInState(ctx, data);
        return next();
    }
}