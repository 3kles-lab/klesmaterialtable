import { Injectable } from '@angular/core';
import { KlesTableComponent } from '../component/table.component';
import { FormArray } from '@angular/forms';
import { KlesColumnConfig } from '../models/columnconfig.model';
import { SafeStyle } from '@angular/platform-browser';
import { AbstractKlesTableService } from './abstracttable.service';

@Injectable({
    providedIn: 'root'
})
export class DefaultKlesTableService extends AbstractKlesTableService {
    //Header
    onHeaderChange(e: any) { }
    onHeaderCellChange(e: any) { }

    //Line
    onCellChange(e: any) { }
    onLineChange(e: any) { }

    //Footer
    onFooterChange(e: any) { }

    //Data
    onDataLoaded() { }

    //Cell Style
    getCellStyle(row: any, column: KlesColumnConfig): SafeStyle { return "" };

    //Sorting
    getSortingDataAccessor = (item, property) => { return item[property] };

    /**Util Table */
    //Manage Record
    addRecord(record) {
        this.table._lines.push(record);
        this.table.dataSource.data = this.table._lines;
        (this.table.form.get('rows') as FormArray).push(this.table.addFormLine(record));
    }

    deleteRecord(event) {
        event.forEach(e => {
            const rowIndex = this.table._lines.indexOf(e);
            this.table.lineFields = this.table.lineFields.filter(
                (value, index) => {
                    return index !== rowIndex;
                }
            );
            (this.table.form.get('rows') as FormArray).removeAt(rowIndex);
            this.table._lines = this.table._lines.filter(f => f !== e);
        })

        console.log('List _lines=', this.table._lines);
        this.table.dataSource.data = this.table._lines;
        this.table.selection.clear();
    }

    /**Setters */
    public setTable(table: KlesTableComponent) {
        this.table = table;
    }

}