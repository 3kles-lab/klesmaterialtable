import { NgModule } from '@angular/core';
import { LazyTableComponent } from './lazytable.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        LazyTableComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [],
    exports: [LazyTableComponent],
    bootstrap: [LazyTableComponent]
})
export class LazyTableModule {}
