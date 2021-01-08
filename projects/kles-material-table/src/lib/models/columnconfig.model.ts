import { Type } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { IKlesFieldConfig, IKlesValidator } from 'kles-material-dynamicforms';

export interface KlesColumnConfig {
    columnDef: string;
    sticky?: boolean;
    header: string;
    visible: boolean;
    disabled?: boolean;
    type: string;
    name?: string;
    ngClass?: any;
    resizable?: boolean;
    headerCell: IKlesFieldConfig;
    cell: IKlesFieldConfig;
    footerCell?: IKlesFieldConfig;
    lineValidations?: IKlesValidator<ValidatorFn>[];
    lineAsyncValidations?: IKlesValidator<AsyncValidatorFn>[];
}
