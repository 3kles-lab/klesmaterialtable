import { KlesFieldAbstract } from '@3kles/kles-material-dynamicforms';
import { OnInit, Component } from '@angular/core';
import { IKlesHeaderFieldConfig } from '../../models/header-field.config.model';

@Component({
    selector: 'kles-form-dynamicheaderfilter',
    template: `
    <div mat-sort-header [disabled]="!field.sortable"><span>{{ field.label | translate}}</span></div>
    @if (field.filterComponent && filterField) {
        <div (click)="stopPropagation($event)" class="filterHeader">
            <ng-container klesDynamicField [group]="group" [field]="filterField" >
            </ng-container>

            @if (field.filterClearable && group.get(field.name).value) {
                <div class="icon-button">
                    <button mat-icon-button aria-label="Clear" type="button" class="icon-button-small"
                    (click)="group.controls[field.name].reset();">
                        <mat-icon>close</mat-icon>
                    </button>
                </div>
               
            }
    </div>
    }
    `,
    styleUrl: './dynamic-headerfilter.component.scss',
})
export class KlesFormDynamicHeaderFilterComponent extends KlesFieldAbstract implements OnInit {
    field: IKlesHeaderFieldConfig;
    filterField: IKlesHeaderFieldConfig;

    ngOnInit(): void {
        super.ngOnInit();
        this.filterField = Object.assign({}, { ...this.field, component: this.field.filterComponent, label: null });
    }

    stopPropagation(event) {
        event.stopPropagation();
    }
}
