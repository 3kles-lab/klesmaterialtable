import { KlesColumnConfig, KlesTableService } from 'kles-material-table';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SafeStyle } from '@angular/platform-browser';
import { classes } from 'polytype';
import * as _ from 'lodash'
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TableService extends classes(KlesTableService) {
    private listColumnPO = ["Style", "Color", "Size"];

    public onLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor() {
        super();
        console.log('TableService Table=', this.table);
    }

    onDataLoaded() {
        console.log('Data loaded=', this.table.getFormArray());
        this.onLoaded.next(true);

    }

    getCellStyle(row: any, column: KlesColumnConfig): SafeStyle {
        if ((row as FormGroup).controls[column.columnDef]?.errors) {
            return 'text-align: center; background-color:lightcoral';
        }
        return super.getCellStyle(row, column);
    };

    //Line
    onCellChange(e: any) {
        // console.warn('CellChange=', e);
        // console.warn('##Error=', this.allErrors(e.group));
        // console.warn('##Error Count=', this.countErrors(e.group));
        super.onCellChange(e);
        // if (e.column.columnDef === '#checker') {
        //     if (e.group.value['#checker'].event) {
        //         console.warn('Button event!!!!');
        //     }
        // }

        this.checkError(e.group);
    }

    onLineChange(e: any) {
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

    checkError(form: FormGroup) {
        let checker = {};
        if (form.pending) {
            checker = {
                busy: true,
                message: 'Contrôle...'
            };
        } else {
            const listError = this.allErrors(form);
            checker = {
                busy: false,
                error: (listError.length > 0) ? listError : null
            };
        }
        form.controls['#checker'].patchValue(checker, { onlySelf: true, emitEvent: false });
        this.table.ref.detectChanges();
    }

    private isFormGroup(control: AbstractControl): control is FormGroup {
        return !!(<FormGroup>control).controls;
    }

    allErrors(control: AbstractControl): any[] {
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

    allControlErrors(control: AbstractControl): any {
        if (this.isFormGroup(control)) {
            const childErrors = _.mapValues(control.controls, (childControl) => {
                return this.allControlErrors(childControl);
            });

            const pruned = _.omitBy(childErrors, _.isEmpty);
            return _.isEmpty(pruned) ? null : pruned;
        }
        return control.errors;
    }

    countControls(control: AbstractControl): number {
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

    countErrors(control: AbstractControl): number {
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