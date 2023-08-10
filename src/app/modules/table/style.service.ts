import { Injectable } from "@angular/core";
import { SafeStyle } from "@angular/platform-browser";
import { KlesColumnConfig, KlesTableService } from "kles-material-table";

@Injectable()
export class StyleService extends KlesTableService {
    public getCellStyle(row: any, column: KlesColumnConfig): SafeStyle {
        if (column.columnDef === 'NAME' && row.value.NAME.startsWith('G')) {
            return 'background-color: rgb(255, 228, 196);';
        }

        return '';
    }

    public getFooterStyle(column: KlesColumnConfig) {
        if (column.columnDef === 'AGE' && this.table.formFooter.controls.AGE.value >= 50) {
            return 'background-color: rgb(146, 208, 80);';
        }

        if (column.columnDef === 'NAME' && this.table.formFooter.controls.NAME.value >= 10) {
            return 'background-color: rgb(255, 215, 0);';
        }

        return '';
    }
}
