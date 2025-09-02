import { componentMapper, EnumType, FieldMapper, KlesFieldAbstract, klesFieldControlFactory } from '@3kles/kles-material-dynamicforms';
import { OnInit, Component, ViewEncapsulation } from '@angular/core';
import { IKlesHeaderFieldConfig } from '../../models/header-field.config.model';
import { Options } from '../../models/options.model';
import { HeaderMapper } from '../../decorators/header.decorator';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KlesDynamicHeaderFilterDirective } from '../../directives/dynamic-header-filter.directive';
import { CapitalizePipe } from '../../pipe/capitalize.pipe';

@HeaderMapper({
    type: 'dynamicHeader', factory: (field: IKlesHeaderFieldConfig) => {
        if (field.filterComponent) {
            return componentMapper.find(c => c.component === field.filterComponent)?.factory ?
                componentMapper.find(c => c.component === field.filterComponent)?.factory(field) : klesFieldControlFactory(field);
        }
        return klesFieldControlFactory(field);
    }
})
@Component({
    selector: 'kles-form-dynamicheaderfilter',
    template: `
    <div class="header" mat-sort-header [disabled]="!field.sortable" [matTooltip]="field.tooltip" matTooltipPosition="above">
        @if(tableOptions?.capitalisedHeader){
            <span>{{ field.label | capitalize }}</span>
        }@else if(tableOptions?.uppercasedHeader){
            <span>{{ field.label | uppercase }}</span>
        }@else{
            <span>{{ field.label }}</span>
        }
    </div>
    @if (field.filterComponent && filterField) {
        <div (click)="stopPropagation($event)" class="filterHeader">
            <ng-container klesDynamicHeaderFilter [group]="group" [field]="filterField">
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
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatSortModule,
        CapitalizePipe,
        KlesDynamicHeaderFilterDirective
    ]
})
export class KlesFormDynamicHeaderFilterComponent extends KlesFieldAbstract implements OnInit {
    field: IKlesHeaderFieldConfig;
    filterField: IKlesHeaderFieldConfig;
    tableOptions: Options<any>;

    ngOnInit(): void {
        super.ngOnInit();
        this.filterField = Object.assign({}, { ...this.field, component: this.field.filterComponent, label: null, tooltip: null });
    }

    stopPropagation(event) {
        event.stopPropagation();
    }
}
