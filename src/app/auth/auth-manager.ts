import { Injectable } from "@angular/core";
import { AppConfig } from "../services/api/app.config";


@Injectable()
export class AuthManager {

    private static authenticated: boolean = true;

    constructor(private config: AppConfig) {
    }

    public static isAuthenticated(): boolean {
        return AuthManager.authenticated;
    }

    public static unAuthenticate(): void {
        AuthManager.authenticated = false;
    }

    public static getToken(config: AppConfig): string | null {
        return config?.authConfig?.type === "bearer-token" ? localStorage.getItem("access_token") : null;
    }

    public authenticate(): void {
        const url = this.config.getAuthUrl(window.location.origin);
        window.location.replace(url);
    }

    public signOut(): void {
        if (this.config?.authConfig?.type === "cookie") {
            const url = `${this.config.authUrl}/en/sign-out?ReturnUrl=${encodeURIComponent(this.config.homeUrl)}`;
            window.location.replace(url);
        } else {
            localStorage.removeItem("access_token");
            this.authenticate();
        }
    }

    public tryAcceptToken(): void {
        const hash = window.location.hash;
        if (!hash || !hash.startsWith("#access_token")) return;

        const param = new URLSearchParams(hash.substring(1));
        window.localStorage.setItem("access_token", param.get("access_token") ?? "");
    }

}
