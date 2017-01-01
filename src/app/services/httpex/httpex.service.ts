import { Injectable } from '@angular/core';
import { LogService } from '../log';
import {
    Http,
    ConnectionBackend,
    RequestOptions,
    RequestOptionsArgs,
    Response,
    Headers,
    Request
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

/**
 * Extended version of angular's Http Service
 * Here we overwrite default HTTP methods by providind extra handling logic
 * to GET, POST, PUT, PATCH, DELETE, HEAD and OPTIONS.
 * There's also an additional error & response handling logic available
 * To activate this service change the boolean value in YOUR_RETAIL_ROOT_DIR/config.json
 */
@Injectable()
export class HttpEx extends Http {
    constructor(private backend: ConnectionBackend,
                private defaultOptions: RequestOptions,
                private logService: LogService) {
        super(backend, defaultOptions);
        // this.logService.logEx('INIT', 'HttpEx');
    }

    public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options);
    }

    public get(url: string, options?: RequestOptionsArgs): Observable<any> {
        this.requestInterceptor();
        return super.get(url, this.requestOptions(options))
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSubscribeSuccess(res);
            }, (error: any) => {
                this.onSubscribeError(error);
            })
            .finally(() => {
                this.onFinally();
            });
    }

    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        this.requestInterceptor();
        return super.post(url, body, this.requestOptions(options))
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSubscribeSuccess(res);
            }, (error: any) => {
                this.onSubscribeError(error);
            })
            .finally(() => {
                this.onFinally();
            });
    }

    public put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        this.requestInterceptor();
        return super.put(url, body, this.requestOptions(options))
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSubscribeSuccess(res);
            }, (error: any) => {
                this.onSubscribeError(error);
            })
            .finally(() => {
                this.onFinally();
            });
    }

    public patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        this.requestInterceptor();
        return super.patch(url, body, this.requestOptions(options))
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSubscribeSuccess(res);
            }, (error: any) => {
                this.onSubscribeError(error);
            })._finally(() => {
                this.onFinally();
            });
    }

    public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        this.requestInterceptor();
        return super.delete(url, this.requestOptions(options))
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSubscribeSuccess(res);
            }, (error: any) => {
                this.onSubscribeError(error);
            })
            .finally(() => {
                this.onFinally();
            });
    }

    public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        this.requestInterceptor();
        return super.head(url, this.requestOptions(options))
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSubscribeSuccess(res);
            }, (error: any) => {
                this.onSubscribeError(error);
            })
            .finally(() => {
                this.onFinally();
            });
    }

    public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        this.requestInterceptor();
        return super.options(url, this.requestOptions(options))
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSubscribeSuccess(res);
            }, (error: any) => {
                this.onSubscribeError(error);
            })
            .finally(() => {
                this.onFinally();
            });
    }

    public getLocal(url: string, options?: RequestOptionsArgs): Observable<any> {
        return super.get(url, options);
    }

    private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        return options;
    }
    /**
     * Intercept any request
     */
    private requestInterceptor(): void {
        // add logic here
    }
    /**
     * Intercept any response
     */
    private responseInterceptor(): void {
        // add logic here
    }
    /**
     * Log any errors
     */
    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        this.logService.logJson(error, 'HttpEx');
        return Observable.throw(error);
    }

    private onSubscribeSuccess(res: Response): void {
        // this.logService.logJson(res, 'HttpEx');
    }
    /*
    * Log any subscription errors
    */
    private onSubscribeError(error: any): void {
        this.logService.logJson(error, 'HttpEx');
    }

    private onFinally(): void {
        this.responseInterceptor();
    }

}
