import * as Koa from "koa";
import {ApiRouter, PublicRouter} from "./routes/index";
import {errorHandler} from "./routes/error-handler";
import {importResource} from "./imports/index";
import {connectToDatabase, dbConnectionDefaultURL} from "./utils/mongoose";
import {createAppointments} from "./imports/import.resource";
import {secure} from "./utils/auth";
import {ensureDataForBooking} from "./utils/ensure.booking.data";
var Router: any = require('koa-router');
const convert: any = require('koa-convert');
// const Router = require('koa-router');
const cors = require('koa-cors');
const bodyparser: any = require('koa-bodyparser');
const practitioners: any = require('../../resources/default.practitioners.json');
const patients: any = require('../../resources/patient-mock.json');
const users: any = require('../../resources/user-mock.json');
export class Server {
    app: any;
    port: number;

    constructor() {
        this.app = new Koa();
        this.port = 3000;
        this.configMiddlewares();
        this.configRoutes();
    }

    private configMiddlewares() {
        this.app.use(bodyparser());
        this.app.use(convert(cors()));
        this.app.use(errorHandler());
    }

    private logRequestTime() {
        this.app.use(async(ctx: any, next: any) => {
            const start: any = new Date();
            await next();
            // logger.info(`${ctx.method} ${ctx.url} - ${+new Date() - start}ms`);
        });
    }
    private configRoutes() {
        let publicRouter: PublicRouter = new PublicRouter({prefix: '/public'});
        this.app.use(publicRouter.routes())
            .use(publicRouter.allowedMethods());

        this.app.use(secure());

        let apiRouter: ApiRouter = new ApiRouter({prefix: '/api'});
        this.app.use(apiRouter.routes(), null)
            .use(apiRouter.allowedMethods(), null);
    }

    async importData() {
        await importResource(practitioners);
        await importResource(patients);
        await importResource(users);
        await createAppointments();
        await ensureDataForBooking();
    }
    async start() {
        await connectToDatabase(dbConnectionDefaultURL);
        await this.importData();
        await this.app.listen(this.port);
        console.log(`Server started on port: ${this.port}`);
    }
}