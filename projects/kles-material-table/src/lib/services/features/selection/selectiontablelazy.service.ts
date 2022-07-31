import { FormGroup } from '@angular/forms';
import { KlesTableComponent } from '../../../component/table/table.component';
import { ISelection } from '../../../interfaces/selection.interface';
import { KlesTableBaseService } from '../tableservice.interface';
import { catchError, map, take } from 'rxjs/operators';
import { of } from 'rxjs';

export class KlesSelectionTableLazyService implements KlesTableBaseService {
    table: KlesTableComponent;
    columnSelect: string;

    constructor(column: string, private selection: ISelection) {
        this.columnSelect = column;
    }

    changeSelectionHeader(e: any) {
        if (this.selection?.selectAll) {
            if (e.column.columnDef === this.columnSelect) {
                const val = (e.group as FormGroup).controls[this.columnSelect].value;
                this.selection.selectAll(val)
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

                        this.table.getFormArray().controls.forEach((row: FormGroup) => {
                            row.controls[this.columnSelect]?.patchValue(response.selected, { emitEvent: false, onlySelf: true });
                        });

                        this.table.ref.markForCheck();
                    });
            }
        }
    }

    changeSelectionLine(e: any) {
        if (this.selection?.select) {
            if (e.column.columnDef === this.columnSelect && e.row) {
                const val = (e.group as FormGroup).controls[e.column.columnDef].value;
                this.selection.select(val)
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
                            (e.group as FormGroup).controls[e.column.columnDef].patchValue(!val, { emitEvent: false });
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
                            this.table.columns.find(f => f.columnDef === this.columnSelect)
                                .headerCell.indeterminate = response.indeterminate;
                        }
                        this.table.ref.markForCheck();
                    });
            }
        }
    }
}
