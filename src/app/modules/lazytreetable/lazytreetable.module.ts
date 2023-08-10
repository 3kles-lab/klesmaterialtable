import { NgModule } from '@angular/core';
import { LazyTreeTableComponent } from './lazytreetable.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        LazyTreeTableComponent
    ],
    imports: [
        SharedModule,
        TranslateModule
    ],
    providers: [],
    exports: [LazyTreeTableComponent],
    bootstrap: [LazyTreeTableComponent]
})
export class LazyTreeTableModule {}
