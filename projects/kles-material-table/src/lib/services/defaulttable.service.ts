import { Injectable } from '@angular/core';
import { KlesTableComponent } from '../component/table.component';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
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
    onStatusHeaderChange(e: any) { }

    //Line
    onCellChange(e: any) { }
    onStatusCellChange(e: any) { }
    onLineChange(e: any) { }
    onStatusLineChange(e: any) { }

    //Footer
    onFooterChange(e: any) { }

    //Data
    onDataLoaded() { }

    //Cell Style
    getCellStyle(row: any, column: KlesColumnConfig): SafeStyle { return "" };

    //Sorting
    getSortingDataAccessor = (item: AbstractControl, property) => {
        // console.log('SortingDataAccesor item=', item);
        // console.log('SortingDataAccesor property=', property);
        // console.log('SortingDataAccesor value=', item?.controls[property]?.value);
        const value: any = item.value[property];
        return typeof value === 'string' ? value.toLowerCase() : value;

    };

    /**Util Table */
    //Manage Record
    addRecord(record) {
        const newRecord = {
            _id: uuid.v4(),
            value: record
        };
        console.log('New Record=', newRecord);
        this.table._lines.push(newRecord);
        this.table.getFormArray().push(this.table.addFormLine(newRecord));
        this.updateDataSource();
    }

    deleteRecord(event: any) {
        event.forEach(e => {
            const rowIndex = this.table._lines.indexOf(e);
            this.table.lineFields = this.table.lineFields.filter(
                (value, index) => {
                    return index !== rowIndex;
                }
            );
            this.table.getFormArray().removeAt(rowIndex);
            this.table._lines = this.table._lines.filter(f => f !== e);
        })

        console.log('List _lines=', this.table._lines);
        this.updateDataSource();
        this.table.selection.clear();
    }


    deleteRecordById(id: string) {
        const rowIndex = this.table._lines.findIndex(line => line._id === id);

        if (rowIndex >= 0) {
            this.table.lineFields = this.table.lineFields.filter(
                (value, index) => {
                    return index !== rowIndex;
                }
            );
            this.table.getFormArray().removeAt(rowIndex);
            this.table._lines = this.table._lines.filter(f => f._id !== id);
        }
        this.updateDataSource();
        this.table.selection.clear();

    }

    protected updateDataSource() {
        this.table.dataSource.data = this.table.getFormArray().controls;
        this.table.dataSource.filteredData = this.table.getFormArray().controls;
    }

    /**Setters */
    public setTable(table: KlesTableComponent) {
        this.table = table;
    }

}