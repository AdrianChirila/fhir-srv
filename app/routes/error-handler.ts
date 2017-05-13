import {IRouterContext} from "koa-router";
import {log} from "util";
export function errorHandler() {
    return async(ctx: IRouterContext, next: any) => {
        try {
            console.log('Request to server::', ctx.request.url);
            await next();
            // Handle 404 upstream.
            var status = ctx.status || 404;
            if (status === 404)
                ctx.throw(404);
        } catch (error) {
            if (error.message) {
                console.log('Error:', error.message);
                if (error.message = 'invalid token') {
                    ctx.status  = 401;
                    ctx.message = 'invalid token!'
                }
            }
        }
    }
}
