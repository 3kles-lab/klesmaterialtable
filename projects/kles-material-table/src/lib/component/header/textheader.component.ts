import { KlesFieldAbstract } from '@3kles/kles-material-dynamicforms';
import { OnInit, Component } from '@angular/core';
import { IKlesHeaderFieldConfig } from '../../models/header-field.config.model';

@Component({
    selector: 'kles-form-textheader',
    template: `
    <div mat-sort-header [disabled]="!field.sortable"><span>{{ field.label | translate}}</span></div>
    `,
    styles: ['mat-form-field {width: calc(100%)}']
})
export class KlesFormTextHeaderComponent extends KlesFieldAbstract implements OnInit {
    field: IKlesHeaderFieldConfig;
    ngOnInit(): void {
        super.ngOnInit();
    }
}
