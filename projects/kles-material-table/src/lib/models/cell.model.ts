import { IKlesFieldConfig } from '@3kles/kles-material-dynamicforms';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { KlesColumnConfig } from './columnconfig.model';

export interface IKlesCellFieldConfig extends IKlesFieldConfig {
    executeAfterChange?: (field: string, value: any) => Observable<any>;
}
export interface IChangeHeaderFooterCell {
    column: KlesColumnConfig;
    group: FormGroup | FormArray;
}

export interface IChangeCell {
    column: KlesColumnConfig;
    row: any;
    group: FormGroup | FormArray;
    response?: any;
}

export interface IChangeLine {
    group: FormGroup | FormArray;
    row: any;
    value: any;
}
