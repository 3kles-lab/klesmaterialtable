import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as _ from 'lodash';
import { LazyTableComponent } from './modules/lazytable/lazytable.component';
import { LazyTreeTableComponent } from './modules/lazytreetable/lazytreetable.component';
import { TableComponent } from './modules/table/table.component';
import { TreeTableComponent } from './modules/treetable/treetable.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        TableComponent,
        LazyTableComponent,
        TreeTableComponent,
        LazyTreeTableComponent,
        TranslateModule
    ]
})
export class AppComponent {

    constructor(private t: TranslateService) {
        console.log(this.t.instant('close.text'));
    }
}
