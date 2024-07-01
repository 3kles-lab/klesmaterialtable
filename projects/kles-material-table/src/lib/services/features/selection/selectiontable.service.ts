import { FormGroup, UntypedFormGroup } from "@angular/forms";
import { KlesTableComponent } from "../../../component/table/table.component";
import { KlesTableBaseService } from "../tableservice.interface";
import { SelectionChange } from "@angular/cdk/collections";

export class KlesSelectionTableService implements KlesTableBaseService {
  table: KlesTableComponent;
  columnSelect: string;

  constructor(column: string) {
    this.columnSelect = column;
  }

  updateSelection(changed: SelectionChange<any>) {
    changed.removed.forEach((group: FormGroup) => {
      group.controls[this.columnSelect].patchValue(false, { emitEvent: false });
    });
    this.table.columns().filter(f => f.columnDef === this.columnSelect)
      .map(m => m.headerCell.indeterminate = !this.table.selection.isEmpty());
    if (this.table.selection.isEmpty()) {
      this.table.formHeader.controls[this.columnSelect]?.patchValue(false, { emitEvent: false });
    }
    this.table.ref.markForCheck();
  }

  changeSelectionHeader(e: any) {
    if (e.column.columnDef === this.columnSelect) {
      const val = (e.group as UntypedFormGroup).controls[this.columnSelect].value;
      this.table.getFormArray().controls
        .filter((e: UntypedFormGroup) => e.controls[this.columnSelect]?.enabled)
        .forEach((e: UntypedFormGroup) => {
          e.controls[this.columnSelect]?.patchValue(val);
        });
    }
  }

  changeSelectionLine(e: any) {
    if (this.table) {
      if (e.column.columnDef === this.columnSelect && e.row) {
        if (this.table.dataSource.filteredData.includes(e.group)) {
          if ((e.group as UntypedFormGroup).controls[e.column.columnDef].value) {
            if (!this.table.selection.isMultipleSelection()) {
              this.table.getFormArray().controls
                .filter((row: UntypedFormGroup) => row.value._id !== e.group.value._id)
                .forEach((row: UntypedFormGroup) => {
                  row.controls[this.columnSelect]?.patchValue(false, { emitEvent: false });
                });
            }

            this.table.selection.select(e.group);

          } else {
            this.table.selection.deselect(e.group);
          }
          this.table._onSelected.emit(this.table.selection.selected);
        } else {
          (e.group as UntypedFormGroup).controls[e.column.columnDef]?.patchValue(false, { onlySelf: true, emitEvent: false });
          this.table.selection.deselect(e.row);
        }
      }
      if (this.isAllSelected()) {

        this.table.columns.update((columns) => {
          columns.filter(f => f.columnDef === this.columnSelect).forEach(m => m.headerCell.indeterminate = false);
          return [...columns];
        });

        this.table.formHeader.controls[this.columnSelect]?.patchValue(true, { onlySelf: true, emitEvent: false });
        this.table.tableService.onSelectIndeterminate.next(false);

      } else {
        this.table.columns().filter(f => f.columnDef === this.columnSelect)
          .map(m => m.headerCell.indeterminate = !this.table.selection.isEmpty());

        this.table.columns.update((columns) => {
          columns.filter(f => f.columnDef === this.columnSelect)
            .forEach(m => m.headerCell.indeterminate = !this.table.selection.isEmpty());
          return [...columns];
        });

        this.table.tableService.onSelectIndeterminate.next(!this.table.selection.isEmpty());
        if (this.table.selection.isEmpty()) {
          this.table.formHeader.controls[this.columnSelect]?.patchValue(false, { onlySelf: true, emitEvent: false });
        }
      }
      this.table.ref.markForCheck();
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
