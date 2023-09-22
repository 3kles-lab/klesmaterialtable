import { TranslateService } from '@ngx-translate/core';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';

export class PaginatorI18n {

    paginatorIntl: MatPaginatorIntl;

    constructor(private readonly translate: TranslateService) { }

    getPaginatorIntl(): MatPaginatorIntl {
        this.paginatorIntl = new MatPaginatorIntl();
        this.paginatorIntl.itemsPerPageLabel = this.translate.instant('ITEMS_PER_PAGE_LABEL');
        this.paginatorIntl.nextPageLabel = this.translate.instant('NEXT_PAGE_LABEL');
        this.paginatorIntl.previousPageLabel = this.translate.instant('PREVIOUS_PAGE_LABEL');
        this.paginatorIntl.firstPageLabel = this.translate.instant('FIRST_PAGE_LABEL');
        this.paginatorIntl.lastPageLabel = this.translate.instant('LAST_PAGE_LABEL');
        this.paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);
        this.translate.onLangChange.subscribe(e => {
            this.paginatorIntl.itemsPerPageLabel = this.translate.instant('ITEMS_PER_PAGE_LABEL');
            this.paginatorIntl.nextPageLabel = this.translate.instant('NEXT_PAGE_LABEL');
            this.paginatorIntl.previousPageLabel = this.translate.instant('PREVIOUS_PAGE_LABEL');
            this.paginatorIntl.firstPageLabel = this.translate.instant('FIRST_PAGE_LABEL');
            this.paginatorIntl.lastPageLabel = this.translate.instant('LAST_PAGE_LABEL');
        });
        return this.paginatorIntl;
    }

    private getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0 || pageSize === 0) {
            return this.translate.instant('RANGE_PAGE_LABEL_1', { length });
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return this.translate.instant('RANGE_PAGE_LABEL_2', { startIndex: startIndex + 1, endIndex: length });
    }
}
