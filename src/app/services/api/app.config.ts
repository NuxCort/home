import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, lastValueFrom } from "rxjs";


@Injectable()
export class AppConfig {
    public loaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private config?: IEnvironmentConfig;

    constructor(private readonly http: HttpClient) {
    }

    public get currentConfig(): IEnvironmentConfig | null { return this.config ?? null; }

    public get homeUrl(): string { return this.config?.homeUrl ?? ""; }

    public get chatUrl(): string { return this.config?.chatUrl ?? ""; }

    public get blogsUrl(): string { return this.config?.blogsUrl ?? ""; }

    public get sitesUrl(): string { return this.config?.sitesUrl ?? ""; }

    public get accountHomeUrl(): string { return `${this.config?.authUrl}/account/dashboard#summary`; }

    public get supportedLanguages(): string[] { return environment.supportedLanguages; }

    public get apiRoot(): string { return `${this.config?.homeUrl}/api`; }

    public get pagesUrl(): string { return this.config?.pagesUrl ?? ""; }

    public get termsUrl(): string { return this.config?.termsUrl ?? ""; }

    public get websiteBuilderUrl(): string { return this.config?.websiteBuilderUrl ?? ""; }

    public get emailMarketingUrl(): string { return this.config?.emailMarketingUrl ?? ""; }

    public get hostingUrl(): string { return this.config?.hostingUrl ?? ""; }

    public get domainsUrl(): string { return this.config?.domainsUrl ?? ""; }

    public get toursUrl(): string { return this.config?.toursUrl ?? ""; }

    public get professorUrl(): string { return this.config?.professorUrl ?? ""; }

    public get supportUrl(): string { return this.config?.supportUrl ?? ""; }

    public get profileUrl(): string { return this.config?.profileUrl ?? ""; }

    public get subscriptionOnboardingUrl(): string { return `${this.config?.profileUrl}/subscription-onboarding`; }

    public get userRolesUrl(): string { return this.config?.userRolesUrl ?? ""; }

    public get dashboardUrl(): string { return this.config?.termsUrl ?? ""; }

    public get accountUrl(): string { return this.config?.accountUrl ?? ""; }

    public get accountSettingsUrl(): string { return this.config?.accountSettingsUrl ?? ""; }

    public get accountSslUrl(): string { return `${this.config?.accountUrl}/shopping#certificates:purchase`; }

    public get changePackageUrl(): string { return this.config?.changePackageUrl ?? ""; }

    public get wpPluginUrl(): string { return ""; }

    public get shoppingCartUrl(): string { return `${this.config?.authUrl}/account/shopping#cart`; }

    public get prod(): boolean { return environment.prodMode; }

    public get version(): string { return environment.version; }

    public get tvDriveUrl(): string { return this.config?.tvDriveUrl ?? ""; }

    public get mailUrl(): string { return this.config?.mailUrl ?? ""; }

    public get tvNotificationsUrl(): string { return `${this.config?.tvNotificationsUrl}/host`; }

    public get applicationInsightsKey(): string { return this.config?.applicationInsightsKey ?? ""; }

    public get adminApiRoot(): string { return `${this.config?.adminRoot}/api`; }

    public get subscriptionUrl(): string { return `${this.config?.authUrl}/new-account/#/account/subscription`; }

    public get authUrl(): string { return this.config?.authUrl ?? ""; }

    public get sharedStorageUrl(): string { return `${this.config?.accountUrl}/shared-storage`; }

    public get authConfig(): IAuthConfig | null { return this.config?.auth ?? null; }

    public get chargeUrl(): string { return environment.chargeUrl; }

    public load(): Promise<void> {
        const configFile = environment.explicitConfig ?? "config.json";
        return lastValueFrom(this.http.get<IEnvironmentConfig>(`./assets/${configFile}?v=${environment.version}`)).then(x => {
            this.config = x;
            this.loaded$.next(true);
        });
    }

    public getAuthUrl(returnUrl: string): string {
        const url = encodeURIComponent(returnUrl);

        if (this.config?.auth?.type === "bearer-token" && this.config.auth.scope) {
            const scope = encodeURIComponent(this.config.auth.scope);
            const clientId = this.config.auth.clientId;
            //implicit grant
            return `${this.config?.authUrl}/oauth/authorize?response_type=token&client_id=${clientId}&scope=${scope}&redirect_uri=${url}&state=1`;
        }
        return `${this.config?.authUrl}/en?ReturnUrl=${url}`;
    }

    public getSwitchAccountUrl(accountId: string): string {
        return `${this.config?.authUrl}/switch-account/${accountId}?redirectUrl=${encodeURIComponent(this.homeUrl)}`;
    }

    public getTempAvaUrl(name: string, color?: string, bg?: string): string {
        const u = name?.substring(0, 1) ?? "U";
        return `${this.homeUrl}/api/avatar?u=${u}&bg=${bg ?? ""}&color=${color ?? ""}`;
    }

    public completeRegistrationUrl(lang?: string, returnUrl?: string): string {
        lang = lang !== undefined && lang !== null && lang.length > 0 ? lang : "en";
        if (returnUrl && returnUrl.length > 0) {
            return `${this.config?.authUrl}/${lang}/complete-registration?ReturnUrl=${encodeURIComponent(returnUrl)}`;
        }

        return `${this.config?.authUrl}/${lang}/complete-registration`;
    }

    public attachmentUrl(data: { id: string, name: string }): string {
        return `${this.homeUrl}/api/attachments/${data.id}/${encodeURIComponent(data.name ? data.name : "")}`;
    }

}

export interface IEnvironmentConfig {
    name: string,
    auth: IAuthConfig,
    homeUrl: string,
    chatUrl: string,
    blogsUrl: string,
    sitesUrl: string,
    authUrl: string,
    trackingScriptName: string,
    termsUrl: string,
    supportUrl: string,
    accountSettingsUrl: string,
    accountSslUrl: string,
    accountUrl: string,
    changePackageUrl: string,
    userRolesUrl: string,
    profileUrl: string,
    websiteBuilderUrl: string,
    emailMarketingUrl: string,
    hostingUrl: string,
    domainsUrl: string,
    toursUrl: string,
    professorUrl: string,
    tvDriveUrl: string,
    mailUrl: string,
    pagesUrl: string,
    tooltipWidgetId: string,
    tooltipWidgetTracking: string,
    tvNotificationsUrl: string,
    applicationInsightsKey: string,
    adminRoot: string
}

export interface IAuthConfig {
    type: "cookie" | "bearer-token",
    clientId?: string,
    scope?: string
}


export const environment = {
    prodMode: false,
    supportedLanguages: ["en", "ru"],
    version: "",
    explicitConfig: null,
    chargeUrl: "https://payments.vcap.cc"
};