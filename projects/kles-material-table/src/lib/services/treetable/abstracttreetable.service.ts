import { Injectable } from "@angular/core";
import { AbstractKlesTableService } from "../abstracttable.service";

@Injectable({
    providedIn: 'root'
})
export abstract class AbstractKlessTreeTableService extends AbstractKlesTableService {
    protected table: any;
    onLineOpen(e: any) { }
    onLineClose(e: any) { }

    public setTable(table: any) {
        this.table = table;
    }

}
