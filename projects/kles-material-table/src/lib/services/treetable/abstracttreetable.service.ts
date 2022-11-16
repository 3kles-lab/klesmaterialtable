import { Injectable } from "@angular/core";
import { AbstractControl, UntypedFormGroup } from "@angular/forms";
import { AbstractKlesTableService } from "../abstracttable.service";

@Injectable({
    providedIn: 'root'
})
export abstract class AbstractKlesTreeTableService extends AbstractKlesTableService {
    protected table: any;
    abstract getDepthDataAccessor(item: AbstractControl, property: string): number;
    abstract getParentDataAccessor(item: UntypedFormGroup, property: string): AbstractControl;
    abstract onLineOpen(e: any);
    abstract onLineClose(e: any);
    abstract updateRow(record: any, options?: { emitEvent: boolean; onlySelf: boolean; });
    abstract addChild(parentId: string, record, index?: number);
    abstract addChildren(parentId: string, record: any[], index?: number);
    abstract deleteChild(parentId: string, record, index?: number);
    abstract deleteChildren(parentId: string);
}
