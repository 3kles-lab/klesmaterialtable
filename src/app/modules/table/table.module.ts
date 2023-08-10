import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        TableComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule
    ],
    providers: [],
    exports: [TableComponent],
    bootstrap: [TableComponent]
})
export class TableModule {}
