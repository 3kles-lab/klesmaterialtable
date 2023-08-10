import { NgModule } from '@angular/core';
import { TreeTableComponent } from './treetable.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        TreeTableComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [],
    exports: [TreeTableComponent],
    bootstrap: [TreeTableComponent]
})
export class TreeTableModule {}
