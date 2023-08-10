import { Injectable } from '@angular/core';
import { classes } from 'polytype';
import { DefaultKlesTableService } from './defaulttable.service';
import { KlesSelectionTableService } from './features/selection/selectiontable.service';
import { PageEvent } from '@angular/material/paginator';
import { KlesHeaderFilterTableService } from './features/filter/headerfilter-table.service';
import { KlesDragDropRowTableService } from './features/dragdrop/dragdroprow.service';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class KlesTableService extends classes(DefaultKlesTableService, KlesSelectionTableService, KlesHeaderFilterTableService, KlesDragDropRowTableService) {

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

    drop(e: any): void {
        this.onDrop(e);
    }


    onLineChange(e: any) { }

    //Footer
    onFooterChange(e: any) { }

    onPageChange(event: PageEvent) { }
}
