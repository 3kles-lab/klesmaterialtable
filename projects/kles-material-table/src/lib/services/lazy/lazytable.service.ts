import { PageEvent } from '@angular/material/paginator';
import { classes } from 'polytype';
import { Observable } from 'rxjs';
import { IPagination } from '../../interfaces/pagination.interface';
import { DefaultKlesTableService } from '../defaulttable.service';
import { KlesSelectionTableService } from '../features/selection/selectiontable.service';

export class KlesLazyTableService extends classes(DefaultKlesTableService, KlesSelectionTableService) {

    constructor(private data: IPagination) {
        super
            (
                { super: KlesSelectionTableService, arguments: ['#select'] },
            );
    }
    //Header 
    onHeaderChange(e: any) {
        this.table.filteredValues$.next(this.table.formHeader.value);
    }
    onHeaderCellChange(e: any) {
        this.changeSelectionHeader(e);
    }

    //Line
    onCellChange(e: any) {
        this.changeSelectionLine(e);
    }

    onLineChange(e: any) { }

    //Footer
    onFooterChange(e: any) { }

    onPageChange(event: PageEvent) {


    }

    load(sort: string, order: string, page: number, perPage: number, filter?: { [key: string]: any; }):
        Observable<{ lines: any[], totalCount: number }> {
        return this.data.list(sort, order, page, perPage, filter);
    }

}
