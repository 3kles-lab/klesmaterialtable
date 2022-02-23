import { Injectable } from '@angular/core';
import { classes } from 'polytype';
import { DefaultKlesTableService } from './defaulttable.service';
import { KlesSelectionTableService } from './features/selection/selectiontable.service';
import { KlesTextFilterTableService } from './features/filter/textfiltertable.service';
import { PageEvent } from '@angular/material/paginator';
import { KlesHeaderFilterTableService } from './features/filter/headerfilter-table.service';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class KlesTableService extends classes(DefaultKlesTableService, KlesSelectionTableService, KlesHeaderFilterTableService) {

    constructor() {
        super
            (
                { super: KlesSelectionTableService, arguments: ['#select'] },
                { super: KlesHeaderFilterTableService },
            );
    }
    //Header 
    onHeaderChange(e: any) {
        this.filterData();
    }
    onHeaderCellChange(e: any) {
        this.changeSelectionHeader(e);
    }

    //Line
    onCellChange(e: any) {
        this.changeSelectionLine(e);
    }

    onLineChange(e: any) { }

    //Footer
    onFooterChange(e: any) { }

    onPageChange(event: PageEvent) { }
}
