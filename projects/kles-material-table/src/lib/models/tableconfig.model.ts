import { Type } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { KlesColumnConfig } from './columnconfig.model';
import { Options } from './options.model';
import { AbstractKlesTableService } from '../services/abstracttable.service';
import { AsyncValidatorFn, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { IKlesCellFieldConfig } from './cell.model';
import { MatPaginatorIntl } from '@angular/material/paginator';

export interface KlesTableConfig {
    tableComponent: Type<any>;
    columns: KlesColumnConfig[];
    tableService: AbstractKlesTableService;
    customMatPaginatorIntl?: Type<MatPaginatorIntl>;
    selectionMode?: boolean;
    options?: Options<any>;
    sortConfig?: Sort;
    hidePaginator?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    lineValidations?: ValidatorFn[];
    lineAsyncValidations?: AsyncValidatorFn[];
    showFooter?: boolean;
    ngClassRow?: (row: UntypedFormGroup) => any;
    multiTemplate?: boolean;
    templates?: {
        cells: (IKlesCellFieldConfig & { colspan?: number, rowspan?: number })[],
        when?: ((index: number, rowData: any) => boolean)
    }[];
    dragDropRows?: boolean;
    dragDropRowsOptions?: {
        autoScrollStep?: number;
    }
}
