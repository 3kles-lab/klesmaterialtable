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

    changed.added.forEach((group: FormGroup) => {
      group.controls[this.columnSelect].patchValue(true, { emitEvent: false });
    });
    this.table._onSelected.emit(this.table.selection.selected);

    this.updateColumnSelect();
  }


  changeSelectionHeader(e: any) {
    if (e.column.columnDef === this.columnSelect) {
      const val = (e.group as UntypedFormGroup).controls[this.columnSelect].value;
      if (val) {
        if (!this.table.selection.isMultipleSelection() && this.table.dataSource.filteredData.length) {
          this.table.selection.select(this.table.dataSource.filteredData?.[0]);
        } else {
          this.table.selection.select(...this.table.dataSource.filteredData);
        }

      } else {
        this.table.selection.deselect(...this.table.dataSource.filteredData);
      }
    } else {
      this.updateColumnSelect();
    }
  }

  changeSelectionLine(e: any) {
    if (this.table) {
      if (e.column.columnDef === this.columnSelect && e.row) {
        if (this.table.dataSource.filteredData.includes(e.group)) {
          if ((e.group as UntypedFormGroup).controls[e.column.columnDef].value) {
            this.table.selection.select(e.group);
          } else {
            this.table.selection.deselect(e.group);
          }
        }
      }

    }
  }

  protected updateColumnSelect() {
    let indeterminate = false;
    let selectAll = false;

    if (this.table?.selection.isEmpty()) {
      indeterminate = false;
      selectAll = false;
    } else {
      if ((!this.table.selection.isMultipleSelection() && this.table.selection.hasValue())
        || (this.table.selection.isMultipleSelection() && this.table.dataSource.filteredData.every((record) => this.table.selection.isSelected(record)))) {
        indeterminate = false;
        selectAll = true;

      } else {
        selectAll = false;
        indeterminate = this.table.selection.hasValue();
      }

    }
    this.table?.columns.update((columns) => {
      columns.filter(f => f.columnDef === this.columnSelect)
        .forEach(m => m.headerCell.indeterminate = indeterminate);
      return [...columns];
    });
    this.table?.formHeader.controls[this.columnSelect]?.patchValue(selectAll, { emitEvent: false });

    this.table?.tableService.onSelectIndeterminate.next(indeterminate);
    this.table.ref.markForCheck();
  }
}
