import { Injectable } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { LegacyPageEvent as PageEvent } from "@angular/material/legacy-paginator";
import { DefaultKlesTableService, KlesHeaderFilterTableService, KlesSelectionClickTableService } from "kles-material-table";
import { classes } from "polytype";

@Injectable()
export class SelectTableService extends classes(DefaultKlesTableService, KlesSelectionClickTableService, KlesHeaderFilterTableService) {

    constructor() {
        super
            (
                { super: KlesSelectionClickTableService, arguments: ['#select'] },
                { super: KlesHeaderFilterTableService },
            );
    }
    //Header 
    onHeaderChange(e: any) {
        this.filterData();
    }

    //Line
    onClick(group: UntypedFormGroup) {
        this.changeClickLine(group);
    }

    onLineChange(e: any) { }

    //Footer
    onFooterChange(e: any) { }

    onPageChange(event: PageEvent) { }
}
