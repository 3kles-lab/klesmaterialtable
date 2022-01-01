import { KlesColumnConfig, KlesTableService } from 'kles-material-table';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SafeStyle } from '@angular/platform-browser';
import { classes } from 'polytype';
import * as _ from 'lodash'
import { BehaviorSubject } from 'rxjs';
import { IChangeCell, IChangeLine } from 'projects/kles-material-table/src/public-api';

@Injectable()
export class TableService extends classes(KlesTableService) {

    public onLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private listFacility = [];
    private listWarehouse = [];

    constructor() {
        super();
    }

    onDataLoaded() {
        this.onLoaded.next(true);

    }

    getCellStyle(row: any, column: KlesColumnConfig): SafeStyle {
        if ((row as FormGroup).controls[column.columnDef]?.errors) {
            return 'text-align: center; background-color:lightcoral';
        }
        return super.getCellStyle(row, column);
    };

    //Line
    onCellChange(e: IChangeCell) {
        super.onCellChange(e);
        // console.warn('##OnCellLineChange=', e);
        // if (e.column.columnDef === 'Warehouse') {
        //     let warehouse = (e.group as FormGroup).controls[e.column.columnDef].value;
        //     console.log('Change Warehouse=', warehouse);

        //     if (typeof warehouse === 'string' && Object.prototype.toString.call(warehouse) === '[object String]') {
        //         console.log('Warehouse string=', warehouse);
        //         warehouse = (this.listWarehouse.find(f => f.WHLO === warehouse)) ? this.listWarehouse.find(f => f.WHLO === warehouse) : warehouse;
        //         (e.group as FormGroup).controls['Warehouse'].patchValue(warehouse, { onlySelf: true, emitEvent: false });
        //     }

        //     const facility = this.listFacility.find(f => f.FACI === warehouse?.FACI);
        //     console.log('Find Facility=', facility);
        //     (e.group as FormGroup).controls['Facility'].patchValue(facility, { onlySelf: true, emitEvent: false });
        // }
        this.checkError(e.group as FormGroup);
    }

    onLineChange(e: IChangeLine) {
        // console.warn('##OnLineChange=', e);
        // if (e.row.error) {
        // console.warn('##Error=', this.allErrors(e.group));
        // const checker = {
        //     busy: false,
        //     counter: e.row.error.length,
        //     error: true
        // };
        // // const checker = { busy: true, message: 'Test', error: [{}, {}] };
        // (e.group as FormGroup).controls['#checker'].patchValue(checker, { onlySelf: true, emitEvent: false });
        // }
        // this.table.ref.detectChanges();
    }

    onStatusLineChange(e: any) {
        // console.warn('Status line change=', e);
        this.checkError(e.group);
    }

    onStatusCellChange(e: any) {
        // console.warn('Status cell change=', e);
    }

    setListFacility(list: any[]) {
        this.listFacility = list;
    }

    setListWarehouse(list: any[]) {
        this.listWarehouse = list;
    }

    checkError(form: FormGroup) {
        let checker = {};
        if (form.pending) {
            checker = {
                busy: true,
                message: 'Contrôle...'
            };
        } else {
            const listError = TableService.allErrors(form);
            checker = {
                busy: false,
                error: (listError.length > 0) ? listError : null
            };
        }
        form.controls['#checker'].patchValue(checker, { onlySelf: true, emitEvent: false });
        this.table.ref.detectChanges();
    }

    static isFormGroup(control: AbstractControl): control is FormGroup {
        return !!(<FormGroup>control).controls;
    }

    static allErrors(control: AbstractControl): any[] {
        let arr = [];
        const allControlErrors = this.allControlErrors(control);
        if (allControlErrors) {
            Object.keys(allControlErrors).map(key => {
                arr.push({ [key]: allControlErrors[key] })
                return arr;
            });
        }
        return arr;
    }

    static allControlErrors(control: AbstractControl): any {
        if (this.isFormGroup(control)) {
            const childErrors = _.mapValues(control.controls, (childControl) => {
                return this.allControlErrors(childControl);
            });

            const pruned = _.omitBy(childErrors, _.isEmpty);
            return _.isEmpty(pruned) ? null : pruned;
        }
        return control.errors;
    }

    static countControls(control: AbstractControl): number {
        if (control instanceof FormControl) {
            return 1;
        }

        if (control instanceof FormArray) {
            return control.controls.reduce((acc, curr) => acc + this.countControls(curr), 1)
        }

        if (control instanceof FormGroup) {
            return Object.keys(control.controls)
                .map(key => control.controls[key])
                .reduce((acc, curr) => acc + this.countControls(curr), 1);

        }
    }

    static countErrors(control: AbstractControl): number {
        if (control instanceof FormControl) {
            return (control as FormControl)?.errors?.length;
        }

        if (control instanceof FormArray) {
            return control.controls.reduce((acc, curr) => acc + this.countErrors(curr), 1)
        }

        if (control instanceof FormGroup) {
            return Object.keys(control.controls)
                .map(key => control.controls[key])
                .reduce((acc, curr) => acc + this.countErrors(curr), 1);

        }
    }

}