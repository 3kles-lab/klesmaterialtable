import { FormArray, FormGroup } from "@angular/forms";
import { KlesColumnConfig } from "./columnconfig.model";

export interface IChangeHeaderFooterCell {
    column: KlesColumnConfig
    group: FormGroup | FormArray,
}

export interface IChangeCell {
    column: KlesColumnConfig,
    row: any,
    group: FormGroup | FormArray,
}

export interface IChangeLine {
    group: FormGroup | FormArray,
    row: any,
    value: any
}