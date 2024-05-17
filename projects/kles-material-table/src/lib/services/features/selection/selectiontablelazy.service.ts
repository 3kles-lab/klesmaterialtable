import { UntypedFormGroup } from '@angular/forms';
import { ISelection } from '../../../interfaces/selection.interface';
import { KlesTableBaseService } from '../tableservice.interface';
import { catchError, map, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { KlesLazyTableComponent } from '../../../component/lazytable/lazytable.component';

export class KlesSelectionTableLazyService implements KlesTableBaseService {
  table: KlesLazyTableComponent;
  columnSelect: string;

  constructor(column: string, private selection: ISelection) {
    this.columnSelect = column;
  }

  changeSelectionHeader(e: any) {
    if (this.selection?.selectAll) {
      if (e.column.columnDef === this.columnSelect) {
        const val = (e.group as UntypedFormGroup).controls[this.columnSelect].value;

        const filterHeader = this.table.columns()
          .filter(column => column.filterable)
          .map(column => {
            return { [column.columnDef]: this.table.formHeader.controls[column.columnDef].value };
          })
          .reduce((a, b) => ({ ...a, ...b }), {});

        this.selection.selectAll(val, filterHeader)
          .pipe(
            take(1),
            map((response) => {
              return { success: true, ...response };
            }),
            catchError(err => {
              console.error(err);
              return of({ success: false, indeterminate: false, selected: false });
            })
          )
          .subscribe((response) => {

            this.table.getFormArray().controls.forEach((row: UntypedFormGroup) => {
              row.controls[this.columnSelect]?.patchValue(response.selected, { emitEvent: false, onlySelf: true });
            });

            if ('footer' in response) {
              this.table.formFooter.patchValue(response.footer);
            }
            this.table.tableService.onSelectIndeterminate.next(response.indeterminate);
            this.table._onSelectedResponse.emit(response);
            this.table.ref.markForCheck();
          });
      }
    }
  }

  changeSelectionLine(e: any) {
    if (this.selection?.select) {
      if (e.column.columnDef === this.columnSelect && e.row) {
        const val = (e.group as UntypedFormGroup).controls[e.column.columnDef].value;
        this.selection.select(val, e.group)
          .pipe(
            take(1),
            map((response) => {
              return { success: true, ...response };
            }),
            catchError(err => {
              console.error(err);
              return of({ success: false, indeterminate: false, selected: false });
            })
          )
          .subscribe((response) => {
            if (!response.success) {
              (e.group as UntypedFormGroup).controls[e.column.columnDef].patchValue(!val, { emitEvent: false });
            } else if (response.success) {
              if (response.indeterminate) {
                this.table.formHeader
                  .controls[this.columnSelect]?.patchValue(false, { onlySelf: true, emitEvent: false });
              } else if (response.selected && !response.indeterminate) {
                this.table.formHeader
                  .controls[this.columnSelect]?.patchValue(true, { onlySelf: true, emitEvent: false });
              } else {
                this.table.formHeader
                  .controls[this.columnSelect]?.patchValue(false, { onlySelf: true, emitEvent: false });
              }

              if ('children' in response) {
                this.table.getFormArray().controls.forEach((row: UntypedFormGroup, index) => {
                  const childSelection = (response.children as any[])?.find((f) => f._id === row.getRawValue()._id);
                  if (childSelection) {
                    const fieldSelection = this.table.lineFields[index];
                    row.controls[this.columnSelect]?.patchValue(
                      (childSelection.indeterminate) ? -1 : childSelection.selected,
                      { emitEvent: false, onlySelf: true });
                    fieldSelection.find(f => f.name === this.columnSelect).indeterminate = !!childSelection.indeterminate;
                  }
                });
              }

              this.table.columns.update((columns) => {
                const idx = columns.findIndex(f => f.columnDef === this.columnSelect);
                if (idx != -1) {
                  columns[idx].headerCell = { ...columns[idx].headerCell, indeterminate: response.indeterminate };
                }
                return [...columns];
              });

              if ('footer' in response) {
                this.table.formFooter.patchValue(response.footer);
              }
              // this.table.tableService.
              this.table.tableService.onSelectIndeterminate.next(response.indeterminate);
            }

            this.table._onSelectedLineResponse.emit(response);
          });
      }
    }
  }
}
