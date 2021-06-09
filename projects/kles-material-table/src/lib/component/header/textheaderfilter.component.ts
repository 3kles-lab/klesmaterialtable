import { KlesFieldAbstract } from '@3kles/kles-material-dynamicforms';
import { OnInit, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'kles-form-textheaderfilter',
    template: `
    <div><span>{{ field.label | translate}}</span></div>
    <mat-form-field [formGroup]="group" class="form-element">
        <ng-container *ngIf="field.autocomplete; else notAutoComplete">
            <input matInput matTooltip="{{field.tooltip}}" [attr.id]="field.id" (click)="stopPropagation($event)" [ngClass]="field.ngClass" [formControlName]="field.name" [placeholder]="field.placeholder | translate" [type]="field.inputType"
            [matAutocomplete]="auto">

            <mat-autocomplete #auto="matAutocomplete">
                <mat-option *ngFor="let option of filteredOption | async" [value]="option">{{option}}</mat-option>
            </mat-autocomplete>
        </ng-container>
        <ng-template #notAutoComplete>
            <input matInput matTooltip="{{field.tooltip}}" [attr.id]="field.id" (click)="stopPropagation($event)" [ngClass]="field.ngClass" [formControlName]="field.name" [placeholder]="field.placeholder | translate" [type]="field.inputType">
        </ng-template>

        <button mat-button matSuffix mat-icon-button aria-label="Clear"
                        (click)="group.controls[field.name].reset(); stopPropagation($event)">
                        <mat-icon>close</mat-icon>
                     </button>

        <mat-spinner matSuffix mode="indeterminate" *ngIf="isPending()" diameter="17"></mat-spinner>

        <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
            <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message | translate}}</mat-error>
        </ng-container>
        <ng-container *ngFor="let validation of field.asyncValidations;" ngProjectAs="mat-error">
            <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message | translate}}</mat-error>
        </ng-container>
    </mat-form-field>
    `,
    styles: ['mat-form-field {width: calc(100%)}']
})
export class KlesFormTextHeaderFilterComponent extends KlesFieldAbstract implements OnInit {

    filteredOption: Observable<any[]>;
    options$: Observable<any[]>;

    ngOnInit(): void {
        if (this.field.options instanceof Observable) {
            this.options$ = this.field.options;
        } else {
            this.options$ = of(this.field.options);
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
