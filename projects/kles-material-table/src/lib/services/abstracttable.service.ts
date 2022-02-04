import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { SafeStyle } from '@angular/platform-browser';
import { IChangeCell, IChangeHeaderFooterCell, IChangeLine } from '../models/cell.model';
import { KlesColumnConfig } from '../models/columnconfig.model';

@Injectable({
    providedIn: 'root'
})
export abstract class AbstractKlesTableService {

    protected table: any;

    //Header
    abstract onHeaderChange(e: any);
    abstract onHeaderCellChange(e: IChangeHeaderFooterCell);
    abstract onStatusHeaderChange(e: any);

    //Line
    abstract onLineChange(e: IChangeLine);
    abstract onStatusLineChange(e: any);
    abstract onCellChange(e: IChangeCell);
    abstract onStatusCellChange(e: any);

    //Footer
    abstract onFooterChange(e: any);
    abstract onFooterCellChange(e: IChangeHeaderFooterCell);

    abstract onDataLoaded();

    abstract getCellStyle(row: any, column: KlesColumnConfig): SafeStyle;

    //Sorting
    abstract getSortingDataAccessor(item: AbstractControl, property);

    //Pagination
    abstract onPageChange(e: PageEvent);

    //Manage Record
    abstract addRecord(record);
    abstract deleteRecord(record);
    abstract updateRecord(record);

    /**Setters */
    public setTable(table: any) {
        this.table = table;
    }
}
