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
    abstract onHeaderChange(e: any);
    abstract onHeaderCellChange(e: any);
    abstract onStatusHeaderChange(e: any);

    //Line
    abstract onLineChange(e: any);
    abstract onStatusLineChange(e: any);
    abstract onCellChange(e: any);
    abstract onStatusCellChange(e: any);

    //Footer
    abstract onFooterChange(e: any);

    abstract onDataLoaded();

    /**Setters */
    public setTable(table: KlesTableComponent) {
        this.table = table;
    }

}