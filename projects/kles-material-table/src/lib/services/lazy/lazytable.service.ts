import { PageEvent } from "@angular/material/paginator";
import { classes } from "polytype";
import { Observable } from "rxjs";
import { IPagination } from "../../interfaces/pagination.interface";
import { DefaultKlesTableService } from "../defaulttable.service";
import { KlesTextFilterTableService } from "../features/filter/textfiltertable.service";
import { KlesSelectionTableService } from "../features/selection/selectiontable.service";

export class KlesLazyTableService extends classes(DefaultKlesTableService, KlesSelectionTableService, KlesTextFilterTableService) {

    constructor(private data: IPagination) {
        super
            (
                { super: KlesSelectionTableService, arguments: ['#select'] },
                { super: KlesTextFilterTableService },
            );
    }
    //Header 
    onHeaderChange(e: any) {
        this.filterData();
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

    load(sort: string, order: string, page: number, perPage: number): Observable<{ lines: any[], totalCount: number }> {
        return this.data.list(sort, order, page, perPage);
    }

}
