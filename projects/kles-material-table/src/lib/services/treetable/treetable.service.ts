import { Injectable } from "@angular/core";
import { classes } from "polytype";
import { KlesSelectionTreetableService } from "../features/selection/selectiontreetable.service";
import { DefaultKlesTreetableService } from "./defaulttreetable.service";
import { KlesDragDropRowTreeTableService } from "../features/dragdrop/dragdroprowtree.service";
import { SelectionChange } from "@angular/cdk/collections";

@Injectable()
export class KlesTreetableService extends classes(DefaultKlesTreetableService, KlesSelectionTreetableService, KlesDragDropRowTreeTableService) {

    constructor() {
        super
            (
                { super: KlesSelectionTreetableService, arguments: ['#select'] },
            );
    }

    onSelectionChange(changed: SelectionChange<any>): void {
        this.updateSelection(changed);
    }

    onHeaderCellChange(e: any) {
        this.changeSelectionHeader(e);
    }

    onCellChange(e: any) {
        this.changeSelectionLine(e);
    }

    drop(e: any): void {
        this.onDrop(e);
    }

    getSortPredicate(index: number, item: any): boolean {
        return this.sortPredicate(index, item);
    }
}
