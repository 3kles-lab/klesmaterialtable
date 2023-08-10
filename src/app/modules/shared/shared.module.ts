import { CommonModule, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { KlesMaterialDynamicformsModule } from '@3kles/kles-material-dynamicforms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { KlesMaterialDialogModule } from '@3kles/kles-material-dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { KlesMaterialTableModule } from 'kles-material-table';
import { MaterialModule } from '../material.module';
import { PaginatorI18n } from '../util/paginator-i18n';

const COMPONENTS = [
];

const PIPES = [
];

const klesModules = [
    KlesMaterialDynamicformsModule,
    KlesMaterialTableModule,
    KlesMaterialDialogModule
];

const DIRECTIVES = [];

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        FlexLayoutModule,
        klesModules,
        NgxMatSelectSearchModule
    ],
    declarations: [
        COMPONENTS,
        PIPES,
        DIRECTIVES
    ],
    exports: [
        MaterialModule,
        FlexLayoutModule,
        COMPONENTS,
        PIPES,
        klesModules,
        ScrollingModule
    ],
    providers: [TitleCasePipe, UpperCasePipe,
        // {
        //     provide: MatPaginatorIntl, deps: [TranslateService],
        //     useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl()
        // }
    ]
})
export class SharedModule { }
