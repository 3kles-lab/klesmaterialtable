import { Type } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { KlesColumnConfig } from './columnconfig.model';
import { Options } from './options.model';
import { AbstractKlesTableService } from '../services/abstracttable.service';
import { IKlesValidator } from '@3kles/kles-material-dynamicforms';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

export interface KlesTableConfig {
    tableComponent: Type<any>;
    columns: KlesColumnConfig[];
    tableService: AbstractKlesTableService;
    selectionMode?: boolean;
    options?: Options<any>;
    sortConfig?: Sort;
    hidePaginator?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    lineValidations?: ValidatorFn[];
    lineAsyncValidations?: AsyncValidatorFn[];
    showFooter?: boolean;
}
