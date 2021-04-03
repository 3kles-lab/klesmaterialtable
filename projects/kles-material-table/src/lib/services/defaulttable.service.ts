import { Injectable } from '@angular/core';
import { KlesTableComponent } from '../component/table.component';
import { FormArray } from '@angular/forms';
import { KlesColumnConfig } from '../models/columnconfig.model';
import { SafeStyle } from '@angular/platform-browser';
import { AbstractKlesTableService } from './abstracttable.service';
import * as uuid from 'uuid';
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
        const newRecord = {
            _id: uuid.v4(),
            value: record
        }
        this.table._lines.push(newRecord);
        this.table.dataSource.data = this.table._lines.map(line => line.value);
        (this.table.form.get('rows') as FormArray).push(this.table.addFormLine(newRecord));
    }

    deleteRecord(event: any) {
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
        this.table.dataSource.data = this.table._lines.map(line => line.value);
        this.table.selection.clear();
    }


    deleteRecordById(id: string) {
        const rowIndex = this.table._lines.findIndex(line => line._id === id);

        if(rowIndex>=0){
            this.table.lineFields = this.table.lineFields.filter(
                (value, index) => {
                    return index !== rowIndex;
                }
            );
            (this.table.form.get('rows') as FormArray).removeAt(rowIndex);
            this.table._lines = this.table._lines.filter(f => f._id !== id);
        }
        this.table.dataSource.data = this.table._lines.map(line => line.value);
        this.table.selection.clear();

    }

    /**Setters */
    public setTable(table: KlesTableComponent) {
        this.table = table;
    }

}