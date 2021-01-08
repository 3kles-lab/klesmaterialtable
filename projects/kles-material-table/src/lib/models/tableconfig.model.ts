import { Type } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { KlesColumnConfig } from './columnconfig.model';
import { Options } from './options.model';
import { AbstractKlesTableService } from '../services/abstracttable.service';

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
}
