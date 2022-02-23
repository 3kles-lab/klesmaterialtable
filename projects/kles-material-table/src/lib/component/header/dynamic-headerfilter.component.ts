import { KlesFieldAbstract } from '@3kles/kles-material-dynamicforms';
import { OnInit, Component } from '@angular/core';
import { IKlesHeaderFieldConfig } from '../../models/header-field.config.model';

@Component({
    selector: 'kles-form-textheaderfilter',
    template: `
    <div mat-sort-header [disabled]="!field.sortable"><span>{{ field.label | translate}}</span></div>    
    <div (click)="stopPropagation($event)">
            <ng-container klesComponentHeader [component]="field.filterComponent" [group]="group" [field]="field" >        
            </ng-container>
    </div>
    `,
    styles: ['mat-form-field {width: calc(100%)}']
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
