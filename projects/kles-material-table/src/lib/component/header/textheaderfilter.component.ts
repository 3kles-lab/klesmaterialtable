import { KlesFieldAbstract } from '@3kles/kles-material-dynamicforms';
import { OnInit, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';
import { IKlesHeaderFieldConfig } from '../../models/header-field.config.model';

@Component({
    selector: 'kles-form-textheaderfilter',
    template: `
    <div mat-sort-header [disabled]="!field.sortable"><span>{{ field.label | translate}}</span></div>
    <mat-form-field [formGroup]="group" class="form-element">
        @if (field.autocomplete) {
            <input matInput matTooltip="{{field.tooltip}}" [attr.id]="field.id" (click)="stopPropagation($event)" [ngClass]="field.ngClass" [formControlName]="field.name" [placeholder]="field.placeholder | translate" [type]="field.inputType"
            [matAutocomplete]="auto">

            <mat-autocomplete #auto="matAutocomplete">
                @for (option of filteredOption | async; track option) {
                    <mat-option [value]="option">{{option}}</mat-option>
                }
            </mat-autocomplete>
        }
        @else {
            <input matInput matTooltip="{{field.tooltip}}" [attr.id]="field.id" (click)="stopPropagation($event)" [ngClass]="field.ngClass" [formControlName]="field.name" [placeholder]="field.placeholder | translate" [type]="field.inputType">
        }

        <button mat-button matSuffix mat-icon-button aria-label="Clear" (click)="group.controls[field.name].reset(''); stopPropagation($event)">
            <mat-icon>close</mat-icon>
        </button>

        @if (isPending()) {
            <mat-spinner matSuffix mode="indeterminate" diameter="17"></mat-spinner>
        }

        @for (validation of field.validations; track validation.name) {
            <ng-container ngProjectAs="mat-error">
                @if (group.get(field.name).hasError(validation.name)) {
                    <mat-error>{{validation.message | translate}}</mat-error>
                }
            </ng-container>
        }
        @for (validation of field.asyncValidations; track validation.name) {
            <ng-container ngProjectAs="mat-error">
                @if (group.get(field.name).hasError(validation.name)) {
                    <mat-error>{{validation.message | translate}}</mat-error>
                }
            </ng-container>
        }
    </mat-form-field>
    `,
    styles: ['mat-form-field {width: calc(100%)}']
})
export class KlesFormTextHeaderFilterComponent extends KlesFieldAbstract implements OnInit {

    field: IKlesHeaderFieldConfig;
    filteredOption: Observable<any[]>;
    options$: Observable<any[]>;

    ngOnInit(): void {
        if (this.field.options instanceof Observable) {
            this.options$ = this.field.options;
        } else {
            this.options$ = of(this.field.options as any);
        }

        this.filteredOption = this.group.get(this.field.name).valueChanges
            .pipe(
                startWith(''),
                switchMap(data => data ? this.filterData(data) : this.options$)
            );
    }

    isPending() {
        return this.group.controls[this.field.name].pending;
    }

    private filterData(value: any): Observable<any[]> {
        let filterValue;

        if (typeof value === 'string' && Object.prototype.toString.call(value) === '[object String]') {
            filterValue = value.toLowerCase();
        } else {
            filterValue = value[this.field.property].toLowerCase();
        }

        if (this.field.property) {
            return this.options$
                .pipe(map(options => options.filter(option => option[this.field.property].toLowerCase().indexOf(filterValue) === 0)));
        }
        return this.options$.pipe(map(options => options.filter(option => option.toLowerCase().indexOf(filterValue) === 0)));
    }


    stopPropagation(event) {
        event.stopPropagation();
    }
}
