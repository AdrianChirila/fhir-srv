import {IRouterContext} from "koa-router";
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
            console.log('Error::', error);
        }
    }
}
