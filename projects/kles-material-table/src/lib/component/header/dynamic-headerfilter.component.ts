import { KlesFieldAbstract } from '@3kles/kles-material-dynamicforms';
import { OnInit, Component } from '@angular/core';
import { IKlesHeaderFieldConfig } from '../../models/header-field.config.model';

@Component({
    selector: 'kles-form-textheaderfilter',
    template: `
    <div mat-sort-header [disabled]="!field.sortable"><span>{{ field.label | translate}}</span></div>
    <div (click)="stopPropagation($event)" *ngIf="field.filterComponent" style="display: inline-flex;">
            <ng-container klesComponentHeader [component]="field.filterComponent" [group]="group" [field]="field" >
            </ng-container>
            <span style="padding-top: 10px;">
                <button *ngIf="field.filterClearable && group.get(field.name).value" mat-button mat-icon-button aria-label="Clear" type="button"
                    (click)="group.controls[field.name].reset();">
                    <mat-icon>close</mat-icon>
                </button>
            </span>
    </div>
    `,
    styles: [`mat-form-field {width: calc(100%)} 
        mat-icon {font-size: 16px; height:16px; width:16px} 
        .mat-mdc-icon-button {padding-bottom: 4px; min-width: 0; width: 22px; height: 22px; flex-shrink: 0; line-height: 1; border-radius: 50%;}`
    ]
})
export class KlesFormDynamicHeaderFilterComponent extends KlesFieldAbstract implements OnInit {
    field: IKlesHeaderFieldConfig;
    ngOnInit(): void {
        super.ngOnInit();
    }

    stopPropagation(event) {
        event.stopPropagation();
    }
}
