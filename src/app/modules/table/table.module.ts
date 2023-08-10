import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        TableComponent
    ],
    imports: [
        SharedModule,
        TranslateModule
    ],
    providers: [],
    exports: [TableComponent],
    bootstrap: [TableComponent]
})
export class TableModule {}
