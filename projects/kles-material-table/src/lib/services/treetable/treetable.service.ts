import { Injectable } from "@angular/core";
import { classes } from "polytype";
import { KlesSelectionTreetableService } from "../features/selection/selectiontreetable.service";
import { DefaultKlesTreetableService } from "./defaulttreetable.service";

@Injectable()
export class KlesTreetableService extends classes(DefaultKlesTreetableService,KlesSelectionTreetableService) {

    constructor() {
        super
            (
                { super: KlesSelectionTreetableService, arguments: ['#select'] },
            );
    }

    onHeaderCellChange(e: any) {
        this.changeSelectionHeader(e);
    }

    onCellChange(e: any) {
        this.changeSelectionLine(e);
    }
}
