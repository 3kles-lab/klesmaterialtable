import { Component, ViewEncapsulation } from "@angular/core";
import { AbstractCell } from "./cell.abstract";
import { KlesColumnConfig } from "../../models/columnconfig.model";
import { UntypedFormGroup } from "@angular/forms";
import { IKlesCellFieldConfig } from "../../models/cell.model";

@Component({
    selector: 'app-kles-fold',
    encapsulation: ViewEncapsulation.None,
    template: `
       
            <div style="display:flex; align-items: center; gap:3px">
                <ng-container *ngIf="(!templateUnfold?.disabled || !templateUnfold?.disabled(group))">
                    <button mat-icon-button aria-label="expand row" (click)="onFoldClick(group); $event.stopPropagation()">
                        <mat-icon> {{group.value._unfold ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}} </mat-icon>
                    </button>
                </ng-container>
                

                <ng-container klesDynamicField [field]="field"
                    [group]="group" [siblingFields]="siblingFields">
                </ng-container>
            </div>
    `,
    styles: [

    ],
})

export class KlesUnfoldCellComponent extends AbstractCell<KlesColumnConfig> {
    // disabled: (row: UntypedFormGroup) => boolean;

    templateUnfold: { cells: IKlesCellFieldConfig[], multiUnfold?: boolean; disabled?: (row: UntypedFormGroup) => boolean; };

    onFoldClick(row: any): void {
        row.controls._unfold.patchValue(!row.value._unfold);
    }
}
