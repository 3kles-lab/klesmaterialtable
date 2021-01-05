import { Injectable } from '@angular/core';
import { AbstractKlesTableService } from './abstracttable.service';
import { classes } from 'polytype';
import { DefaultKlesTableService } from './defaulttable.service';
import { KlesSelectionTableService } from './features/selection/selectiontable.service';
import { KlesTextFilterTableService } from './features/filter/textfiltertable.service';

@Injectable({
    providedIn: 'root'
})
export class KlesTableService extends classes(DefaultKlesTableService, KlesSelectionTableService, KlesTextFilterTableService) {

    onHeaderChange() {
        this.filterData();
    }
    onCellChange() {
    }
    onLineChange() {
    }
    onFooterChange() {
    }
}