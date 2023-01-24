import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { AuthManager } from "src/app/auth/auth-manager";


import { AppConfig } from "./app.config";

@Injectable()
export class ApiClient {

    constructor(
        protected http: HttpClient,
        protected config: AppConfig,
        protected router: Router,
        protected zone: NgZone) {
    }

    protected get apiRoot(): string { return this.config.apiRoot; }

    public getObservable<TResult = any>(url: string): Observable<TResult> {
        const response$ = this.http.get(`${this.apiRoot}/${url}`, { headers: this.getHeaders(), observe: "response", withCredentials: this.getCredentialsOption() }) as any as Observable<HttpResponse<TResult>>;
        return this.parse(response$);
    }

    public get<TResult = any>(url: string, silent?: boolean, full: boolean = false): Promise<TResult | null> {
        const observable = this.http.get(`${this.apiRoot}/${url}`, { headers: this.getHeaders(), observe: "response", withCredentials: this.getCredentialsOption() }) as any as Observable<HttpResponse<TResult>>;
        return this.subscribe<TResult>(observable, url, silent, full);
    }

    public getLocal(url: string, silent?: boolean, full: boolean = false): Promise<any> {
        const observable = this.http.get(url, { headers: this.getHeaders(), observe: "response", withCredentials: this.getCredentialsOption() });
        return this.subscribe(observable, url, silent, full);
    }

    public getQuery(url: string, params: any | null, silent?: boolean): Promise<any> {
        const httpParams = this.getHttpParams(params);
        const observable = this.http.get(`${this.apiRoot}/${url}`, { headers: this.getHeaders(), params: httpParams, observe: "response", withCredentials: this.getCredentialsOption() });
        return this.subscribe(observable, url, silent);
    }

    public postQuery(url: string, params: any | null, body: any | null, silent?: boolean): Promise<any> {
        const httpParams = this.getHttpParams(params);
        const observable = this.http.post(`${this.apiRoot}/${url}`, body, { headers: this.getHeaders(), params: httpParams, observe: "response", withCredentials: this.getCredentialsOption() });
        return this.subscribe(observable, url, silent);
    }

    public delete(url: string, body: unknown, silent?: boolean): Promise<any> {
        const observable = this.http.delete(`${this.apiRoot}/${url}`, { headers: this.getHeaders(), body: JSON.stringify(body), observe: "response", withCredentials: this.getCredentialsOption() });
        return this.subscribe(observable, url, silent);
    }

    public post(url: string, data: unknown, silent?: boolean): Promise<any> {
        const observable = this.http.post(`${this.apiRoot}/${url}`, JSON.stringify(data), { headers: this.getHeaders(), observe: "response", withCredentials: this.getCredentialsOption() });
        return this.subscribe(observable, url, silent);
    }

    public uploadFile(url: string, data: unknown, silent?: boolean): Promise<any> {
        const observable = this.http.post(`${this.apiRoot}/${url}`, data, { headers: {}, observe: "response", withCredentials: this.getCredentialsOption() });
        return this.subscribe(observable, url, silent);
    }

    public put(url: string, data: unknown, silent?: boolean): Promise<any> {
        const observable = this.http.put(`${this.apiRoot}/${url}`, JSON.stringify(data), { headers: this.getHeaders(), observe: "response", withCredentials: this.getCredentialsOption() });
        return this.subscribe(observable, url, silent);
    }

    public uploadFileWithProgress(url: string, data: unknown): Observable<FileProgress | LocalFileReference> {
        const post = this.http.post(`${this.apiRoot}/${url}`, data, {
            headers: {},
            observe: "events",
            reportProgress: true,
            withCredentials: this.getCredentialsOption(),
        });

        return post.pipe(catchError(this.catchAccessErrors as any), map(this.toFileProgress));
    }

    // - https://restful-api-design.readthedocs.io/en/latest/methods.html#actions
    public action(url: string, data: IRESTAction, silent?: boolean): Promise<any> {
        const observable = this.http.patch(`${this.apiRoot}/${url}`, JSON.stringify(data), { headers: this.getHeaders(), observe: "response", withCredentials: this.getCredentialsOption() });
        return this.subscribe(observable, url, silent);
    }

    protected getHeaders(): HttpHeaders {
        const token = AuthManager.getToken(this.config);
        const headers = new HttpHeaders({
            "content-type": "application/json",
            "cache-control": "no-cache",
            "Authorization": token ? `Bearer ${token}` : []
        });
        return headers;
    }

    protected getCredentialsOption(): boolean | undefined {
        return undefined;
    }

    protected subscribe<TResult = any>(observable: Observable<HttpResponse<TResult>>, url: string, silent?: boolean, full: boolean = false): Promise<TResult | null> {
        const promise = new Promise<TResult | null>((resolve, reject) => {
            observable.subscribe({
                next: r => {
                    setTimeout(() => {
                        this.zone.run(() => {
                            if (full) {
                                resolve(r as any as TResult);
                            } else {
                                resolve(r.body);
                            }
                        });
                    });
                },
                error: r => {
                    if (silent) {
                        if (r.status === 500) {
                            resolve({ code: "500" } as any as TResult);
                        } else {
                            resolve(r.error || null);
                        }
                    } else {
                        if (r.status === 400) {
                            resolve(r.error || null);
                        }
                        if (r.status === 401) {
                            AuthManager.unAuthenticate();
                            const loginUrl = this.config.getAuthUrl(window.location.origin);
                            window.location.replace(loginUrl);
                            reject(r);
                            return;
                        }
                        if (r.status === 402) {
                            // const purchaseUrl = this.config.purchaseSubscriptionUrl();
                            // window.location.replace(purchaseUrl);
                            reject(r);
                            return;
                        }
                        if (r.status === 403) {
                            // this.evtDispatcher.publish(new EventItem(EventItem.EVT_ACCESS_DENIED, status));
                            resolve(null);
                        }
                        resolve(null);
                    }
                }
            });
        });

        return promise;
    }


    protected parse<TResult = any>(observable: Observable<HttpResponse<TResult>>): Observable<TResult> {
        return observable.pipe(
            tap(response => {
                if (response.status === 401) {
                    AuthManager.unAuthenticate();
                    const loginUrl = this.config.getAuthUrl(window.location.href);
                    window.location.replace(loginUrl);
                } else if (response.status === 402) {
                    // const purchaseUrl = this.config.purchaseSubscriptionUrl();
                    // window.location.replace(purchaseUrl);
                } else if (response.status === 403) {
                    // this.evtDispatcher.publish(new EventItem(EventItem.EVT_ACCESS_DENIED, status));
                }
            }),
            map<HttpResponse<TResult>, TResult>(response => {
                if (response.ok) {
                    return response.body as any;
                } else {
                    return null;
                }
            })
        );
    }

    protected catchAccessErrors = (error: HttpErrorResponse) => {
        switch (error.status) {
            case 401:
                AuthManager.unAuthenticate();
                const loginUrl = this.config.getAuthUrl(this.config.homeUrl);
                window.location.replace(loginUrl);
                return;
            case 402:
                // const purchaseUrl = this.config.purchaseSubscriptionUrl();
                // window.location.replace(purchaseUrl);
                // break;
                return throwError(() => error);
            case 403:
                //this.evtDispatcher.publish(new EventItem(EventItem.EVT_ACCESS_DENIED, status));
                return throwError(() => error);
            default:
                return throwError(() => error);
        }
    };

    private toFileProgress = (event: HttpEvent<any>): FileProgress | LocalFileReference => {
        switch (event.type) {
            case HttpEventType.Sent:
                return new FileProgress(0, 1);
            case HttpEventType.UploadProgress:
                return new FileProgress(event.loaded, event.total ?? 1);
            case HttpEventType.ResponseHeader:
                return new FileProgress(1, 1);
            case HttpEventType.DownloadProgress:
                return new FileProgress(1, 1);
            case HttpEventType.Response:
                return event.body as LocalFileReference;
            default:
                return new FileProgress(0, 1);
        }
    };

    private getHttpParams(params: any | null): HttpParams {
        let httpParams = new HttpParams();
        if (params != null) {
            Object.keys(params).forEach(key => {
                const value = params[key];
                if (value instanceof Array) {
                    value.forEach(item => {
                        httpParams = httpParams.append(key, item);
                    });
                } else if (value !== null && value !== undefined) {
                    httpParams = httpParams.append(key, value);
                }
            });
        }

        return httpParams;
    }
}

export class FileProgress {

    public readonly progress: number;

    constructor(
        public readonly loaded: number,
        public readonly total: number) {
        this.progress = (loaded / total) * 100;
    }

    public get completed(): boolean {
        return this.progress >= 1;
    }

    public get isNaN(): boolean {
        return Number.isNaN(this.progress);
    }

}

export interface IRESTAction {
    type: "Enable" | "Disable" | "Delete" | "Status" | "EnableIndexing" | "DisableIndexing" | "FavoriteOn" | "FavoriteOff" | "RemoveFromForms" | "AddToForms" | "Move";
    range: string; // coma separated id's
    args?: string; 
}

export interface LocalFileReference {
    readonly id: string;
    readonly name: string;
    readonly size: number;
}
