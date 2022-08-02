import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
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
    onLineChange(e: IChangeLine) { }
    onStatusLineChange(e: any) { }

    //Footer
    onFooterChange(e: any) { }
    onFooterCellChange(e: IChangeHeaderFooterCell) { }

    //Paginator
    onPageChange(e: any) { }

    //Data
    onDataLoaded() { }

    //Cell Style
    getCellStyle(row: any, column: KlesColumnConfig): SafeStyle { return "" };

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
    addRecord(record, index?: number): FormGroup {
        const _id = record._id || uuid.v4();
        delete record._id;

        const newRecord = {
            _id,
            _index: typeof index === 'undefined' ? this.table._lines.length : index,
            value: record
        };

        const group: FormGroup = this.table.addFormLine(newRecord);

        if (typeof index !== 'undefined') {

            (this.table.getFormArray() as FormArray).controls.forEach((row: FormGroup) => {
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

        return group;
    }

    deleteRecord(event: AbstractControl[]) {
        // console.log('Delete Record=', event);
        event.forEach((e: FormGroup) => {
            const id = e.controls['_id'].value;
            const index = this.table.getFormArray().value.findIndex(f => f._id === id);
            this.table.getFormArray().removeAt(index);
            this.table._lines = this.table._lines.filter(f => f._id !== id);
        });
        // console.log('List _lines=', this.table._lines);
        this.updateDataSource();
        this.table.selection.clear();
    }


    updateRecord(record, options?: { emitEvent: boolean, onlySelf: boolean }) {
        const updateForm = this.table.getFormArray().controls
            .find((f: FormGroup) => f.controls._id.value === '' + record._id);
        if (updateForm) {
            updateForm.patchValue(record, options);
            this.updateDataSource();
            this.table.ref.detectChanges();
        }
    }


    // deleteRecordById(id: string) {
    //     const rowIndex = this.table._lines.findIndex(line => line._id === id);

    //     if (rowIndex >= 0) {
    //         this.table.lineFields = this.table.lineFields.filter(
    //             (value, index) => {
    //                 return index !== rowIndex;
    //             }
    //         );
    //         this.table.getFormArray().removeAt(rowIndex);
    //         this.table._lines = this.table._lines.filter(f => f._id !== id);
    //     }
    //     this.updateDataSource();
    //     this.table.selection.clear();

    // }

    protected updateDataSource() {
        this.table.dataSource.data = this.table.getFormArray().controls;
        this.table.dataSource.filteredData = this.table.getFormArray().controls;
    }

    /**Setters */
    public setTable(table: any) {
        this.table = table;
    }

}
