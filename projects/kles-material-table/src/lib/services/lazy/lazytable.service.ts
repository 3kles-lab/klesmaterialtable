import { PageEvent } from '@angular/material/paginator';
import * as _ from 'lodash';
import { classes } from 'polytype';
import { Observable } from 'rxjs';
import { IPagination } from '../../interfaces/pagination.interface';
import { ISelection } from '../../interfaces/selection.interface';
import { DefaultKlesTableService } from '../defaulttable.service';
import { KlesSelectionTableLazyService } from '../features/selection/selectiontablelazy.service';
import { KlesDragDropRowTableService } from '../features/dragdrop/dragdroprow.service';
import { KlesUnfoldRowTableService } from '../features/unfoldrow/unfoldrow.service';

export class KlesLazyTableService extends classes(DefaultKlesTableService, KlesSelectionTableLazyService, KlesDragDropRowTableService, KlesUnfoldRowTableService) {

    constructor(private pagination: IPagination, selection?: ISelection) {
        super
            (
                { super: KlesSelectionTableLazyService, arguments: ['#select', selection] },
                { super: KlesUnfoldRowTableService },
            );
    }
    //Header 
    onHeaderChange(e: any) {
        const value = { ...this.table.formHeader.value };

        this.table.columns.forEach(column => {
            if (!column.filterable) {
                delete value[column.columnDef];
            }
        });

        if (!_.isEqual(this.table.filteredValues$.getValue(), value)) {
            this.table.filteredValues$.next(value);
        }
    }
    onHeaderCellChange(e: any) {
        this.changeSelectionHeader(e);
    }

    //Line
    onCellChange(e: any) {
        this.changeSelectionLine(e);
    }

    onLineChange(e: any) {
        this.unfoldRow(e);
        super.onLineChange(e);
    }

    //Footer
    onFooterChange(e: any) { }

    onPageChange(event: PageEvent) {


    }

    drop(e: any): void {
        this.onDrop(e);
    }

    getSortPredicate(index: number, item: any): boolean {
        return true;
    }

    load(sort: string, order: string, page: number, perPage: number, filter?: { [key: string]: any; }):
        Observable<{ lines: any[], totalCount: number, footer?: any, header?: any }> {
        return this.pagination.list(sort, order, page, perPage, filter);
    }

    reload(): void {
        this.table.reload$.next();
    }

}
