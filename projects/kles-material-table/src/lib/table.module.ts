import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';
import { KlesTableComponent } from './component/table.component';
import { MaterialModule } from './modules/material.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KlesFormTextHeaderFilterComponent } from './component/header/textheaderfilter.component';
import { KlesMaterialDynamicformsModule } from '@3kles/kles-material-dynamicforms';
import { KlesTableDirective } from './directives/table.directive';
import { AbstractKlesTableService } from './services/abstracttable.service';
import { KlesTableService } from './services/table.service';
import { KlesResizeColumnDirective } from './directives/resizecolumn.directive';
const components = [KlesTableComponent, KlesFormTextHeaderFilterComponent];
const directives = [KlesTableDirective, KlesResizeColumnDirective];
const services = [AbstractKlesTableService, KlesTableService];

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
