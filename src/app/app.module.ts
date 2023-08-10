import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { KlesMaterialTableModule } from 'kles-material-table';
import { MaterialModule } from './modules/material.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FakeApiService } from './services/fakemi.service';
import { KlesMaterialDynamicformsModule } from '@3kles/kles-material-dynamicforms';
import { KlesMaterialDialogModule } from '@3kles/kles-material-dialog';
import { AutocompleteComponent } from './components/autocomplete.component';
import { LazyTableModule } from './modules/lazytable/lazytable.module';
import { LazyTreeTableModule } from './modules/lazytreetable/lazytreetable.module';
import { TableModule } from './modules/table/table.module';
import { TreeTableModule } from './modules/treetable/treetable.module';
import { SharedModule } from './modules/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    AutocompleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    KlesMaterialDialogModule,
    KlesMaterialDynamicformsModule,
    KlesMaterialTableModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
        }
      }
    ),
    TableModule,
    LazyTableModule,
    TreeTableModule,
    LazyTreeTableModule,

  ],
  providers: [TranslateService, FakeApiService],
  bootstrap: [AppComponent]
})

export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

