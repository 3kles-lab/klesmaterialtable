import { KlesFieldAbstract } from '@3kles/kles-material-dynamicforms';
import { OnInit, Component } from '@angular/core';
import { IKlesHeaderFieldConfig } from '../../models/header-field.config.model';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';

@Component({
    selector: 'kles-form-textheader',
    template: `
    <div mat-sort-header [disabled]="!field.sortable"><span>{{ field.label }}</span></div>
    `,
    styles: ['mat-form-field {width: calc(100%)}'],
    standalone: true,
    imports: [
        CommonModule,
        MatSortModule
    ]
})
export class KlesFormTextHeaderComponent extends KlesFieldAbstract implements OnInit {
    field: IKlesHeaderFieldConfig;
    ngOnInit(): void {
        super.ngOnInit();
    }
}
