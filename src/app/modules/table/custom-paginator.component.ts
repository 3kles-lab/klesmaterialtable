import { Injectable } from "@angular/core";
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from "@angular/material/legacy-paginator";

@Injectable()
export class CustomPaginator extends MatPaginatorIntl {
    itemsPerPageLabel = 'Exemples par page :';

    getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return '0 - 0';
        }

        length = Math.max(length, 0);
        const startIndex = page * pageSize;

        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return startIndex + 1 + ' - ' + endIndex + ' sur ' + (endIndex >= length ? endIndex : length - 1) + ' exemples';
    };
}
