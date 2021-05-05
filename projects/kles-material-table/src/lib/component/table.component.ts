import { SelectionModel } from '@angular/cdk/collections';
import {
    AfterViewInit, Component, OnInit, ViewChild, EventEmitter,
    Input, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy,
    ChangeDetectorRef, Inject, ViewEncapsulation
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DateAdapter } from '@angular/material/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from "@angular/material/paginator"
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { KlesColumnConfig } from '../models/columnconfig.model';
import { Options } from '../models/options.model';
import { Node } from '../models/node.model';
import { IKlesFieldConfig, IKlesValidator } from '@3kles/kles-material-dynamicforms';
import { DefaultKlesTableService } from '../services/defaulttable.service';

import * as uuid from 'uuid';
import * as _ from 'lodash';

@Component({
    selector: 'app-kles-dynamictable',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class KlesTableComponent implements OnInit, OnChanges, AfterViewInit {
    protected paginator: MatPaginator;
    protected sort: MatSort;
    private sortDefault = false;

    @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }

    @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.setDataSourceAttributes();
    }

    /** Input Component */
    @Input() _lines: Node[] = [];
    @Input() set lines(lines: any | any[]) { this.updateData(lines); }

    @Input() columns = [] as KlesColumnConfig[];
    @Input() selectionMode = true;
    @Input() options: Options<any> = {
        verticalSeparator: true,
        capitalisedHeader: true,
        highlightRowOnHover: true,
        elevation: 5
    };
    @Input() sortConfig: Sort;
    @Input() hidePaginator: boolean = false;
    @Input() pageSize = 10;
    @Input() pageSizeOptions = [5, 10, 20, 25, 50];
    @Input() showFooter: boolean = false;

    @Input() lineValidations: ValidatorFn[];
    @Input() lineAsyncValidations: AsyncValidatorFn[];

    /** Output Component */
    @Output() _onLoaded = new EventEmitter();
    @Output() _onSelected = new EventEmitter();
    @Output() _onChangeHeaderCell = new EventEmitter();
    @Output() _onChangeCell = new EventEmitter();
    @Output() _onChangeFooterCell = new EventEmitter();
    @Output() _onStatusHeaderChange = new EventEmitter();
    @Output() _onStatusLineChange = new EventEmitter();
    @Output() _onStatusCellChange = new EventEmitter();

    // Table
    formHeader: FormGroup;
    form: FormGroup;
    lineFields: IKlesFieldConfig[][];
    formFooter: FormGroup;
    dataSource = new MatTableDataSource<AbstractControl>([]);
    selection = new SelectionModel<AbstractControl>(this.selectionMode);

    displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);

    constructor(protected translate: TranslateService,
        protected adapter: DateAdapter<any>,
        private fb: FormBuilder,
        public ref: ChangeDetectorRef,
        protected dialog: MatDialog,
        public sanitizer: DomSanitizer,
        @Inject('tableService') public tableService: DefaultKlesTableService
    ) {
        this.tableService.setTable(this);
    }

    ngOnInit() {
        this.formHeader = this.initFormHeader();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.columns) {
            this.columns = changes.columns.currentValue;
            this.formHeader = this.initFormHeader();
        }
        if (changes.lines) {
            this.updateData(changes.lines.currentValue);
        }
        if (changes.selectionMode) {
            this.selectionMode = changes.selectionMode.currentValue;
            this.selection = new SelectionModel<any>(this.selectionMode);
        }
    }

    ngAfterViewInit() {
        this.setDataSourceAttributes();
        this.displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);
    }

    /** Form Header */
    initFormHeader() {
        const group = this.fb.group({});
        this.columns.forEach(column => {
            column.headerCell.name = column.columnDef;
            const control = this.buildControlField(column.cell, column.headerCell.value || '');
            control.valueChanges.subscribe(e => {
                const group = control.parent;
                this._onChangeHeaderCell.emit({ column, group });
                this.tableService.onHeaderCellChange({ column, group });
            })
            group.addControl(column.headerCell.name, control);
        });

        group.valueChanges.subscribe(e => {
            this.tableService.onHeaderChange(e);
        });
        group.statusChanges.subscribe(e => {
            this.tableService.onStatusHeaderChange(e);
            this._onStatusHeaderChange.emit(e);
        });
        return group;
    }

    /** Form Array Line Table */
    initFormArray() {
        this.lineFields = [];
        let cpt = 0;
        const array = this.fb.array(this._lines.map(row => {
            return this.addFormLine(row);
        }));
        return array;
    }

    addFormLine(row): FormGroup {
        const group = this.fb.group({});
        const listField = [];
        this.columns.forEach(column => {
            column.cell.name = column.columnDef;
            const control = this.buildControlField(column.cell, row.value[column.cell.name]);
            listField.push({ ...column.cell });
            control.valueChanges.subscribe(e => {
                const group = control.parent;
                this.tableService.onCellChange({ column, row, group });
                this._onChangeCell.emit({ column, row, group });
            });
            control.statusChanges.subscribe(status => {
                const group = control.parent;
                this.tableService.onStatusCellChange({ cell: control, group, status });
                this._onStatusCellChange.emit({ cell: control, group, status });
            });

            group.addControl(column.cell.name, control);
        });
        this.lineFields.push(listField);

        group.setValidators(this.lineValidations);
        group.setAsyncValidators(this.lineAsyncValidations);

        group.valueChanges.subscribe(value => {
            this.tableService.onLineChange({ group, row, value });
        });

        group.statusChanges.subscribe(status => {
            this.tableService.onStatusLineChange({ group, row, status });
            this._onStatusLineChange.emit({ group, row, status });
        });
        return group;
    }

    /** Form Footer */
    initFormFooter() {
        const group = this.fb.group({});
        this.columns.forEach(column => {
            column.footerCell.name = column.columnDef;
            const control = this.buildControlField(column.cell, column.footerCell.value || '');
            control.valueChanges.subscribe(e => {
                const group = control.parent;
                this._onChangeFooterCell.emit({ column, group });
            })
            group.addControl(column.footerCell.name, control);
        });

        group.valueChanges.subscribe(e => {
            // console.log('Line change table=', e);
            // console.log('Parent change line table=', group);
        })
        return group;
    }

    /**Field and control */
    buildControlField(field: IKlesFieldConfig, value?: any): FormControl {
        if (field.type === 'button') {
            return;
        }
        if (!value) { value = '' };
        const control = this.fb.control(
            value,
            this.bindValidations(field.validations || []),
            this.bindAsyncValidations(field.asyncValidations || [])
        );
        if (field.disabled) {
            control.disable();
        }
        return control;
    }

    getFormArray(): FormArray {
        return (this.form.get('rows') as FormArray)
    }

    getFilterFormArray(): FormArray {
        const tempFormArray: FormArray = (this.form.get('rows') as FormArray);
        tempFormArray.controls = this.dataSource.filteredData;
        return tempFormArray;
    }

    getActualIndex(index: number) {
        if (this.paginator && !this.hidePaginator) {
            return index + this.paginator.pageSize * this.paginator.pageIndex;
        }
        return index;
    }

    getControls(index) {
        //console.log('GetControls index=', index, "=", (this.form.get('rows') as FormArray).controls);
        //(this.form.get('rows') as FormArray).push
        //(this.form.get('rows') as FormArray).removeAt(index)
        //return (this.form.get('rows') as FormArray).controls[index];
        return this.getFilterFormArray().controls[this.getActualIndex(index)];
    }

    getLineFields(index, key) {
        return this.lineFields[this.getActualIndex(index)].find(f => f.name === key);
    }

    /**Manage Data */

    /**
* Method to set the data lines to datasource table
*/
    protected setItems() {
        this.form = this.fb.group({
            rows: this.initFormArray()
        });
        // this.dataSource.data = this._lines.map(l => l.value);
        this.dataSource.data = this.getFormArray().controls;
        this.dataSource.filteredData = this.getFormArray().controls;
        // this.getFormArray();
        // .map(l => {
        //     return this.columns.filter(c => c.visible).map(c => c.columnDef).reduce((a, b) => {
        //         return {
        //             ...a,
        //             [b]: l[b]
        //         }
        //     }, {});
        // });
        this.getFormArray().valueChanges.subscribe(e => {
            // console.log('Value change on rows in form table=', e);
            //this.tableService.onLineChange(e);
        });
        this._onLoaded.emit();
        this.tableService.onDataLoaded();
    }

    updateData(lines: any[]) {
        this._lines = lines.map(l => {
            const data = { ...l };
            const options = data.options;
            delete data.options;
            return {
                _id: uuid.v4(),
                ...options && { options },
                value: data,

            };
        });
        this.displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);
        //            this.showFooter = this.columns.some(column => column.total);
        this.setItems();
    }

    setDataSourceAttributes() {
        setTimeout(() => this.dataSource.paginator = this.paginator);
        if (this.sort) {
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = this.tableService.getSortingDataAccessor;
            if (this.paginator) {
                this.sort.sortChange.subscribe(() => {
                    this.paginator.pageIndex = 0;
                });
            }
            if (!this.sortDefault && this.sortConfig) {
                // console.log('Active default sort');
                this.sort.active = this.sortConfig.active;
                this.sort.direction = this.sortConfig.direction;
                this.sort.sortChange.emit(this.sortConfig);
                this.sortDefault = !this.sortDefault;
            }
        }
    }

    public getSelectedLines(): any[] {
        return this.getFormArray().controls.filter(f => this.selection.isSelected(f));
    }

    /** Table rendering */

    /**
     * Method to rendering cell color
     * @param row
     * @param column
     */
    getCellStyle(row: any, column: KlesColumnConfig): SafeStyle {
        return this.tableService.getCellStyle(row, column);
    }

    /**
     * Method to check if column is sticky
     * @param column
     */
    isSticky(column: KlesColumnConfig): boolean {
        return column.sticky || false;
    }

    formatElevation(): string {
        return `mat-elevation-z${this.options.elevation}`;
    }

    /**Validation */
    protected bindValidations(validations: IKlesValidator<ValidatorFn>[]): ValidatorFn {
        if (validations.length > 0) {
            const validList = [];
            validations.forEach(valid => {
                validList.push(valid.validator);
            });
            return Validators.compose(validList);

        }
        return null;
    }

    protected bindAsyncValidations(validations: IKlesValidator<AsyncValidatorFn>[]): AsyncValidatorFn {
        if (validations.length > 0) {
            const validList = [];
            validations.forEach(valid => {
                validList.push(valid.validator);
            });
            return Validators.composeAsync(validList);

        }
        return null;
    }

    public isSortingDisabled(column: KlesColumnConfig): boolean {
        return column.sortable || false;
    }
}
