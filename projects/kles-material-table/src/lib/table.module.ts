import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';
import { KlesTableComponent } from './component/table.component';
import { MaterialModule } from './modules/material.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KlesFormTextHeaderFilterComponent } from './component/header/textheaderfilter.component';
import { KlesMaterialDynamicformsModule } from 'kles-material-dynamicforms';
import { KlesTableDirective } from './directives/table.directive';
import { AbstractKlesTableService } from './services/abstracttable.service';
import { KlesTableService } from './services/table.service';
import { KlesResizeColumnDirective } from './directives/resizecolumn.directive';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorI18n } from './paginator/PaginatorI18n';

const components = [KlesTableComponent, KlesFormTextHeaderFilterComponent];
const directives = [KlesTableDirective, KlesResizeColumnDirective];
const services = [AbstractKlesTableService, KlesTableService, {
    provide: MatPaginatorIntl, deps: [TranslateService],
    useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl()
}];

@NgModule({
    declarations: [
        components,
        directives
    ],
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        KlesMaterialDynamicformsModule
    ],
    exports: [
        components,
        directives
    ],
    entryComponents: [
        components
    ],
    providers: [
        services
    ]
})
export class KlesMaterialTableModule { }
