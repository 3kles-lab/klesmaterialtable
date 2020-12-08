import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';
import { TableComponent } from './component/table.component';
import { MaterialModule } from './modules/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextHeaderFilterComponent } from './component/header/textheaderfilter.component';

const components = [TableComponent, TextHeaderFilterComponent];

@NgModule({
    declarations: [
        components
    ],
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [
        components
    ],
    entryComponents: [
        components
    ]
})
export class TableModule { }
