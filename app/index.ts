import * as Koa from "koa";
import {ApiRouter} from "./routes/index";
import {errorHandler} from "./routes/error-handler";

const Router = require('koa-router');
const cors = require('koa-cors');
const bodyparser: any = require('koa-bodyparser');

export  class Server {
    app: any;
    port: number;

    constructor() {
        // logger.info('Start creating KOA Server');

        this.app = new Koa();
        this.port = 3000;
        // this.port = getConfig().port;

        this.configMiddlewares();
        this.configRoutes();
    }

    private configMiddlewares() {
        // logger.info('Config Middlewares');

        this.logRequestTime();

        // TODO: Change uploads from config
        this.app.use(bodyparser());
        this.app.use(cors());
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
        let apiRouter = new ApiRouter({prefix: '/api'});
        this.app.use(apiRouter.routes())
            .use(apiRouter.allowedMethods());
    }

    async start() {
        await this.app.listen(this.port);
        console.log(`Server started on port: ${this.port}`);
    }
}