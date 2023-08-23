import { Type } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { KlesColumnConfig } from './columnconfig.model';
import { Options } from './options.model';
import { AbstractKlesTableService } from '../services/abstracttable.service';
import { AsyncValidatorFn, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { IKlesCellFieldConfig } from './cell.model';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Span } from '../enums/span.enum';

export interface KlesTableConfig {
    id?: string;
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
    templateUnfold?: {
        disabled?: (row: UntypedFormGroup) => boolean;
        cells: (IKlesCellFieldConfig & { colspan?: number | Span, rowspan?: number })[];
        multiUnfold?: boolean;
    };
    templates?: {
        cells: (IKlesCellFieldConfig & { colspan?: number | Span, rowspan?: number })[],
        when?: ((index: number, rowData: any) => boolean)
    }[];
    dragDropRows?: boolean;
    dragDropRowsOptions?: {
        autoScrollStep?: number;
        connectedTo?: string[];
        dragDisabled?: (row: UntypedFormGroup) => boolean;
        dragPreview?: {
            matchSize?: boolean;
            component: Type<any>;
        };
        dragPlaceholder?: {
            component: Type<any>;
        }
    }
}
