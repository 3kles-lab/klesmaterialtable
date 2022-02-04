import { Injectable } from '@angular/core';
import { classes } from 'polytype';
import { DefaultKlesTableService } from './defaulttable.service';
import { KlesSelectionTableService } from './features/selection/selectiontable.service';
import { KlesTextFilterTableService } from './features/filter/textfiltertable.service';
import { PageEvent } from '@angular/material/paginator';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class KlesTableService extends classes(DefaultKlesTableService, KlesSelectionTableService, KlesTextFilterTableService) {

    constructor() {
        super
            (
                { super: KlesSelectionTableService, arguments: ['#select'] },
                { super: KlesTextFilterTableService },
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
