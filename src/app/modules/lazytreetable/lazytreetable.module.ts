import { NgModule } from '@angular/core';
import { LazyTreeTableComponent } from './lazytreetable.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        LazyTreeTableComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [],
    exports: [LazyTreeTableComponent],
    bootstrap: [LazyTreeTableComponent]
})
export class LazyTreeTableModule {}
