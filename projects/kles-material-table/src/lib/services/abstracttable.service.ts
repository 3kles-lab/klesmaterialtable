import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export abstract class AbstractKlesTableService {

    protected table: any;

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
    public setTable(table: any) {
        this.table = table;
    }

}