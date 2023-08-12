import { IKlesFieldConfig } from '@3kles/kles-material-dynamicforms';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { KlesColumnConfig } from './columnconfig.model';
import { CdkDropList } from '@angular/cdk/drag-drop';

export interface IKlesCellFieldConfig extends IKlesFieldConfig {
    executeAfterChange?: (property?: string, row?: any, group?: UntypedFormGroup | UntypedFormArray) => Observable<any>;
}
export interface IChangeHeaderFooterCell {
    column: KlesColumnConfig;
    group: UntypedFormGroup | UntypedFormArray;
}

export interface IChangeCell {
    column: KlesColumnConfig;
    row: any;
    group: UntypedFormGroup | UntypedFormArray;
    response?: any;
}

export interface IChangeLine {
    group: UntypedFormGroup | UntypedFormArray;
    row: any;
    value: any;
}

export interface IDropRow {
    container?: CdkDropList<any>;
    group: UntypedFormGroup | UntypedFormArray;
    previousIndex: number;
    currentIndex: number;
}
