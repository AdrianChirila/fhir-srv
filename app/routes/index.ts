import {OrganizationRouter} from "./organization.router";
export  {OrganizationRouter} from "./organization.router"
import KoaRouter = require('koa-router')
import {AuthRouter} from "./auth.router";
import {PatientRouter} from "./patient.router";
import {AppointmentRouter} from "./appointment.router";

export class ApiRouter extends KoaRouter {
    constructor(args: any) {
        super(args);
        this.use('/Organization', new OrganizationRouter(null).routes());
        this.use('/Patient', new PatientRouter(null).routes());
        this.use('/Appointment', new AppointmentRouter(null).routes());
    }
}
/*
 export class PublicRouter extends Router {
 constructor(args: any) {
 super(args);
 //public routes goes here
 this.use(APP_ROUTES.AUTH_URL, new AuthRouter(null).routes())
 }
 }
 */
export class PublicRouter extends  KoaRouter {
    constructor(args: any) {
        super(args);
        this.use('/auth', new AuthRouter(null).routes());
    }
}