import { UntypedFormGroup } from "@angular/forms";
import { KlesTableComponent } from "../../../component/table/table.component";
import { KlesTableBaseService } from "../tableservice.interface";

export class KlesSelectionClickTableService implements KlesTableBaseService {
    table: KlesTableComponent;
    columnSelect: string;

    constructor(column?: string) {
        this.columnSelect = column;
    }

    changeClickLine(group: UntypedFormGroup) {
        if (this.table) {
            if (this.table.dataSource.filteredData.includes(group)) {
                if (!this.table.selection.isMultipleSelection()) {
                    this.table.getFormArray().controls
                        .filter((row: UntypedFormGroup) => row.value._id !== group.value._id)
                        .forEach((row: UntypedFormGroup) => {
                            row.controls[this.columnSelect]?.patchValue(false, { emitEvent: false });
                        });
                }
                if (!this.table.selection.isSelected(group)) {
                    this.table.selection.select(group);
                    group.controls[this.columnSelect]?.patchValue(true, { emitEvent: false });
                } else {
                    this.table.selection.deselect(group);
                    group.controls[this.columnSelect]?.patchValue(false, { emitEvent: false });
                }
                this.table._onSelected.emit(this.table.selection.selected);
            } else {
                this.table.selection.deselect(group);
                group.controls[this.columnSelect]?.patchValue(false, { emitEvent: false });
            }
            this.table.ref.markForCheck();
        }
    }
}