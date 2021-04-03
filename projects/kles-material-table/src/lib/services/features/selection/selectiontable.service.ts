import { FormArray, FormGroup } from "@angular/forms";
import { KlesTableComponent } from "../../../component/table.component";
import { KlesTableBaseService } from "../tableservice.interface";

export class KlesSelectionTableService implements KlesTableBaseService {
    table: KlesTableComponent;
    columnSelect: string;

    constructor(column: string) {
        this.columnSelect = column;
    }

    changeSelectionHeader(e: any) {
        if (e.column.columnDef === this.columnSelect) {
            const val = (e.group as FormGroup).controls[this.columnSelect].value;
            (this.table.form.get('rows') as FormArray).controls.forEach((e: FormGroup) => {
                e.controls[this.columnSelect].patchValue(val);
            })
        }
    }

    changeSelectionLine(e: any) {
        if (this.table) {
            if (e.column.columnDef === this.columnSelect && e.row) {
                if (this.table.dataSource.filteredData.includes(e.row.value)) {
                    if ((e.group as FormGroup).controls[e.column.columnDef].value) {
                        this.table.selection.select(e.row);
                    } else {
                        this.table.selection.deselect(e.row);
                    }
                    console.log('emit', this.table.selection.selected)
                    this.table._onSelected.emit(this.table.selection.selected);
                } else {
                    (e.group as FormGroup).controls[e.column.columnDef].patchValue(false, { onlySelf: true, emitEvent: false });
                    this.table.selection.deselect(e.row);
                }
            }
            if (this.isAllSelected()) {
                this.table.columns.filter(f => f.columnDef === this.columnSelect).map(m => m.headerCell.indeterminate = false);
                this.table.formHeader.controls[this.columnSelect].patchValue(true, { onlySelf: true, emitEvent: false });

            } else {
                this.table.columns.filter(f => f.columnDef === this.columnSelect).map(m => m.headerCell.indeterminate = !this.table.selection.isEmpty());
                if (this.table.selection.isEmpty()) {
                    this.table.formHeader.controls[this.columnSelect].patchValue(false, { onlySelf: true, emitEvent: false });
                }
            }
        }
    }

    isAllSelected(): boolean {
        if (this.table) {
            const numSelected = this.table.selection.selected
                .filter(s => this.table.dataSource.filteredData.includes(s)).length;
            const numRows = this.table.dataSource.filteredData.length;
            return numSelected === numRows;
        }
        return false;
    }
}