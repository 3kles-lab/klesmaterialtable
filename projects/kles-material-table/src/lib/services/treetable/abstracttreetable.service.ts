import { Injectable } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { AbstractKlesTableService } from "../abstracttable.service";

@Injectable({
    providedIn: 'root'
})
export abstract class AbstractKlesTreeTableService extends AbstractKlesTableService {
    protected table: any;
    abstract getDepthDataAccessor(item: AbstractControl, property: string): number;
    abstract getParentDataAccessor(item: FormGroup, property: string): AbstractControl;
    abstract onLineOpen(e: any);
    abstract onLineClose(e: any);

}
