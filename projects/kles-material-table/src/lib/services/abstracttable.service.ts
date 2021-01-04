import { Injectable } from '@angular/core';
import { KlesTableComponent } from '../component/table.component';
import { FormArray } from '@angular/forms';
import { KlesColumnConfig } from '../models/columnconfig.model';
import { SafeStyle } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export abstract class AbstractKlesTableService {

    protected table: KlesTableComponent;

    //Header
    abstract onHeaderChange();

    //Line
    abstract onCellChange();
    abstract onLineChange();

    //Footer
    abstract onFooterChange();

    //Cell Style
    getCellStyle(row: any, column: KlesColumnConfig): SafeStyle { return "" };

    //Sorting
    getSortingDataAccessor = (item, property) => { return item[property] };

    /**Util Table */

    //Selection
    isAllSelected() {
        const numSelected = this.table.selection.selected
            .filter(s => this.table.dataSource.filteredData.includes(s)).length;
        // const numSelected = this.selection.selected.length;
        const numRows = this.table.dataSource.filteredData.length;
        // const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.table.dataSource.filteredData.forEach(row => {
                this.table.selection.deselect(row);
                // this._onSelected.emit(row);
            })
            // this.selection.clear()
            :
            this.table.dataSource.filteredData.forEach(row => {
                this.table.selection.select(row);
                // this._onSelected.emit(row);
            });
        this.table._onSelected.emit(this.table.selection.selected);
    }

    changeSelectLine(row) {
        console.log('changeSelectLine for row=', row);
        if (row) {
            this.table.selection.toggle(row);
            this.table._onSelected.emit(this.table.selection.selected);
        }
    }

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