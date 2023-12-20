import { Injectable } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { KlesColumnConfig } from '../models/columnconfig.model';
import { SafeStyle } from '@angular/platform-browser';
import { AbstractKlesTableService } from './abstracttable.service';
import * as uuid from 'uuid';
import { IChangeCell, IChangeHeaderFooterCell, IChangeLine } from '../models/cell.model';
@Injectable({
    providedIn: 'root'
})
export class DefaultKlesTableService extends AbstractKlesTableService {


    //Header
    onHeaderChange(e: any) { }
    onHeaderCellChange(e: IChangeHeaderFooterCell) { }
    onStatusHeaderChange(e: any) { }

    //Line
    onCellChange(e: IChangeCell) { }
    onStatusCellChange(e: any) { }
    onLineChange(e: IChangeLine) {
        if (this.table.multiTemplate) {
            this.table.matTable.renderRows();
        }
    }
    onStatusLineChange(e: any) { }
    onClick(e: any) { }

    //drag and drop
    drop(e: any) { }

    getSortPredicate(index: number, item: any): boolean {
        return true;
    }

    //Footer
    onFooterChange(e: any) { }
    onFooterCellChange(e: IChangeHeaderFooterCell) { }

    //Paginator
    onPageChange(e: any) { }

    //Data
    onDataLoaded() { }

    //Cell Style
    getCellStyle(row: any, column: KlesColumnConfig): SafeStyle { return ''; }
    getFooterStyle(column: KlesColumnConfig): SafeStyle { return ''; }

    //Sorting
    getSortingDataAccessor = (item: AbstractControl, property) => {
        if (!item.value) {
            return item.value;
        }
        let value: any = item.value[property];

        if (value) {
            if (typeof value === 'string') {
                value = value.toLowerCase();
            }
            else if (typeof value === 'object') {
                if (value.key) {
                    value = value.key;
                }
            }
        }

        return value;
    };

    /**Util Table */
    //Manage Record
    addRecord(record, index?: number): UntypedFormGroup {
        const _id = record._id || uuid.v4();
        delete record._id;

        const newRecord = {
            _id,
            _index: typeof index === 'undefined' ? this.table._lines.length : index,
            value: record
        };

        const group: UntypedFormGroup = this.table.addFormLine(newRecord);

        if (typeof index !== 'undefined') {

            (this.table.getFormArray() as UntypedFormArray).controls.forEach((row: UntypedFormGroup) => {
                if (row.value._index >= index) {
                    row.patchValue({ _index: row.value._index + 1 }, { emitEvent: false });
                }
            });
            this.table._lines.forEach((line) => {
                if (line._index >= index) {
                    line._index = line._index + 1;
                }
            });

            this.table._lines.splice(index, 0, newRecord);
            this.table.getFormArray().insert(index, group);
        } else {
            this.table._lines.push(newRecord);
            this.table.getFormArray().push(group);
        }

        this.updateDataSource();
        this.table.matTable?.updateStickyColumnStyles();

        return group;
    }

    deleteRecord(event: AbstractControl[]) {
        // console.log('Delete Record=', event);
        event.forEach((e: UntypedFormGroup) => {
            const id = e.controls['_id'].value;
            const index = this.table.getFormArray().controls.findIndex(f => f.value._id === id);
            this.table.getFormArray().removeAt(index);
            this.table._lines = this.table._lines.filter(f => f._id !== id);
        });
        // console.log('List _lines=', this.table._lines);
        this.updateDataSource();
        this.table.selection.clear();
    }


    updateRecord(record, options?: { emitEvent: boolean, onlySelf: boolean }) {
        const updateForm = this.table.getFormArray().controls
            .find((f: UntypedFormGroup) => f.controls._id.value === '' + record._id);
        if (updateForm) {
            updateForm.patchValue(record, options);
            this.updateDataSource();
            this.table.ref.detectChanges();
        }
    }

    protected updateDataSource() {
        this.table.dataSource.data = this.table.getFormArray().controls;
        this.table.dataSource.filteredData = this.table.getFormArray().controls;
    }

    unfoldPredicate = (index: any, data: any) => {
        return data.controls._unfold.value;
    }

    /**Setters */
    public setTable(table: any) {
        this.table = table;
    }

}
