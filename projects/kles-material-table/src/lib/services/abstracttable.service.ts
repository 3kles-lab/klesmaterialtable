import { Injectable } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { SafeStyle } from '@angular/platform-browser';
import { IChangeCell, IChangeHeaderFooterCell, IChangeLine } from '../models/cell.model';
import { KlesColumnConfig } from '../models/columnconfig.model';
import { Subject } from 'rxjs';
import { SelectionChange } from '@angular/cdk/collections';
@Injectable({
    providedIn: 'root'
})
export abstract class AbstractKlesTableService {

    protected table: any;
    public onSelectIndeterminate: Subject<boolean> = new Subject<boolean>();

    //Selection
    abstract onSelectionChange(changed: SelectionChange<any>);

    //Header
    abstract onHeaderChange(e: any);
    abstract onHeaderCellChange(e: IChangeHeaderFooterCell);
    abstract onStatusHeaderChange(e: any);

    //Line
    abstract onLineChange(e: IChangeLine);
    abstract onStatusLineChange(e: any);
    abstract onCellChange(e: IChangeCell);
    abstract onStatusCellChange(e: any);
    abstract onClick(e: any);

    //drag and drop
    abstract drop(e: any);
    abstract getSortPredicate(index: number, item: any): boolean;

    //Footer
    abstract onFooterChange(e: any);
    abstract onFooterCellChange(e: IChangeHeaderFooterCell);

    abstract onDataLoaded();

    abstract getCellStyle(row: any, column: KlesColumnConfig): SafeStyle;
    abstract getFooterStyle(column: KlesColumnConfig): SafeStyle;

    //Sorting
    abstract getSortingDataAccessor(item: AbstractControl, property);

    //Pagination
    abstract onPageChange(e: PageEvent);

    //Manage Record
    abstract addRecord(record, index?: number): UntypedFormGroup;
    abstract deleteRecord(record);
    abstract updateRecord(record, options?: { emitEvent: boolean, onlySelf: boolean });

    abstract unfoldPredicate: ((index, data) => boolean);

    /**Setters */
    public setTable(table: any) {
        this.table = table;
    }
}
