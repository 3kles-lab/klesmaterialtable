import { Injectable } from '@angular/core';
import { classes } from 'polytype';
import { DefaultKlesTableService } from './defaulttable.service';
import { KlesSelectionTableService } from './features/selection/selectiontable.service';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { KlesHeaderFilterTableService } from './features/filter/headerfilter-table.service';
import { KlesDragDropRowTableService } from './features/dragdrop/dragdroprow.service';
import { KlesUnfoldRowTableService } from './features/unfoldrow/unfoldrow.service';
import { interval } from 'rxjs';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class KlesTableService extends classes(DefaultKlesTableService, KlesSelectionTableService, KlesHeaderFilterTableService,
    KlesDragDropRowTableService, KlesUnfoldRowTableService) {

    constructor() {
        super
            (
                { super: KlesSelectionTableService, arguments: ['#select'] },
                { super: KlesHeaderFilterTableService },
                { super: KlesUnfoldRowTableService },
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

    getSortPredicate(index: number, item: any): boolean {
        return this.sortPredicate(index, item);
    }

    onLineChange(e: any) {
        this.unfoldRow(e);
        this.table.matTable.renderRows();
    }

    //Footer
    onFooterChange(e: any) { }

    onPageChange(event: PageEvent) { }
}
