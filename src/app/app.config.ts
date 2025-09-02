import { ApplicationConfig, importProvidersFrom, inject, LOCALE_ID, provideAppInitializer } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

registerLocaleData(localeFr);

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json');

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: LOCALE_ID, useValue: 'fr-FR' },
        importProvidersFrom([TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            }
        })]),
        provideAppInitializer(() => {
            const translateService = inject(TranslateService);

            translateService.setDefaultLang('fr');

            const translateObs = translateService.use('fr');

            return forkJoin([translateObs]);
        })
    ]
};
