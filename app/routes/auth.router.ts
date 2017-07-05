import {
    OK, NOT_FOUND, LAST_MODIFIED, NOT_MODIFIED, BAD_REQUEST, ETAG,
    CONFLICT, METHOD_NOT_ALLOWED, NO_CONTENT, CREATED
} from '../utils';
import {UserModel as User} from "../models"
import Router = require('koa-router')
import {getLogger} from '../utils';
import {createToken} from "../utils/auth";
import {PatientModel as Patient} from "../models/patient.model";
const log = getLogger('auth');



export class AuthRouter extends Router {
    constructor(args: any) {
        super(args);
        this.post('/session', async(ctx: any) => {
            let reqBody = ctx.request.body;
            reqBody.password = reqBody.password.trim();
            reqBody.pid = reqBody.pid.trim();
            console.log('xxx User:::', reqBody);
            if (!reqBody.pid || !reqBody.password) {
                log(`session - missing username and password`);
                ctx.body = {message: 'Missing username and password'};
                // setIssueRes(ctx.response, BAD_REQUEST, [{error: 'Both username and password must be set'}])
                return;
            }
            let dbUser = await User.findOne({
                pid: reqBody.pid, password: reqBody.password
            });

            if (dbUser && dbUser.password === reqBody.password) {
                ctx.status = CREATED;
                ctx.response.body = {role: dbUser.role, token: createToken(dbUser)};
                if (dbUser.activity.actor.patient) {
                    let dbPatient: any = await Patient.findById(dbUser.activity.actor.patient);
                    ctx.response.body.generalPractitioner = dbPatient.generalPractitioner;
                }
                log(`session - token created`);
            } else {
                log(`session - wrong password`);
                ctx.body = {message: "Wrong username or password"};
                ctx.status = 401;
                // setIssueRes(ctx.response, BAD_REQUEST, [{error: 'Wrong password'}])
            }
        })
    }
}











