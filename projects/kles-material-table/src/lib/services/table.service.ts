import { Injectable } from '@angular/core';
import { AbstractKlesTableService } from './abstracttable.service';
import { classes } from 'polytype';
import { DefaultKlesTableService } from './defaulttable.service';
import { KlesSelectionTableService } from './features/selection/selectiontable.service';
import { KlesTextFilterTableService } from './features/filter/textfiltertable.service';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class KlesTableService extends classes(DefaultKlesTableService, KlesSelectionTableService, KlesTextFilterTableService) {

    constructor() {
        // super();
        // this.columnExclude = '#select';
        // this.columnSelect = '#select';

        super
            (
                { super: KlesSelectionTableService, arguments: ['#select'] },
                { super: KlesTextFilterTableService, arguments: ['#select'] }
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
}