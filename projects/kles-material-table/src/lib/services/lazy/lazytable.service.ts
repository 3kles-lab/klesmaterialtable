import { PageEvent } from '@angular/material/paginator';
import * as _ from 'lodash';
import { classes } from 'polytype';
import { Observable, of } from 'rxjs';
import { IPagination } from '../../interfaces/pagination.interface';
import { ISelection } from '../../interfaces/selection.interface';
import { DefaultKlesTableService } from '../defaulttable.service';
import { KlesSelectionTableLazyService } from '../features/selection/selectiontablelazy.service';
import { KlesDragDropRowTableService } from '../features/dragdrop/dragdroprow.service';
import { KlesUnfoldRowTableService } from '../features/unfoldrow/unfoldrow.service';
import { AbstractKlesLazyTableService } from './abstractlazytable.service';
import { catchError, shareReplay, take } from 'rxjs/operators';

export class KlesLazyTableService extends classes(DefaultKlesTableService, KlesSelectionTableLazyService, KlesDragDropRowTableService, KlesUnfoldRowTableService) implements AbstractKlesLazyTableService {

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

        this.table.columns().forEach(column => {
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
        Observable<{ lines: any[], totalCount: number, footer?: any, header?: any, indeterminate?: boolean }> {
        const obs = this.pagination.list(sort, order, page, perPage, filter).pipe(shareReplay(1));
        obs.pipe(
            take(1),
            catchError(() => {
                return of({indeterminate: false });
            })
        ).subscribe((response) => {
                this.table.columns.update((columns) => {
                    const idx = columns.findIndex(f => f.columnDef === this.columnSelect);
                    if (idx != -1) {
                        columns[idx].headerCell = { ...columns[idx].headerCell, indeterminate: response.indeterminate };
                    }
                    return [...columns];
                });
            })
        return obs;
    }

    reload(): void {
        this.table.reload$.next();
    }

}
