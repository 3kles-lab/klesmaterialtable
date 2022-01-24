import { SelectionModel } from '@angular/cdk/collections';
import {
    AfterViewInit, Component, OnInit, ViewChild, EventEmitter,
    Input, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy,
    ChangeDetectorRef, Inject, OnDestroy
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { KlesColumnConfig } from '../models/columnconfig.model';
import { Options } from '../models/options.model';
import { Node } from '../models/node.model';
import { IKlesFieldConfig, IKlesValidator } from '@3kles/kles-material-dynamicforms';

import * as uuid from 'uuid';
import * as _ from 'lodash';
import { takeUntil, tap } from 'rxjs/operators';
import { IChangeCell, IChangeHeaderFooterCell } from '../models/cell.model';
import { AbstractKlesTableService } from '../services/abstracttable.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-kles-dynamictable',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class KlesTableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    protected paginator: MatPaginator;
    protected sort: MatSort;
    private sortDefault = false;

    private _onDestroy = new Subject<void>();

    @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }

    @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.setDataSourceAttributes();
    }

    /** Input Component */
    @Input() _lines: Node[] = [];
    @Input() set lines(lines: any | any[]) {
        this.updateData(lines);
    }

    @Input() _footer: any = {};
    @Input() set footer(footer: any) {
        if (footer) {
            this.updateFooter(footer);
        }
    }

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
    @Output() _onSelected = new EventEmitter<AbstractControl[]>();
    @Output() _onChangeHeaderCell = new EventEmitter<IChangeHeaderFooterCell>();
    @Output() _onChangeCell = new EventEmitter<IChangeCell>();
    @Output() _onChangeFooterCell = new EventEmitter<IChangeHeaderFooterCell>();
    @Output() _onStatusHeaderChange = new EventEmitter();
    @Output() _onStatusLineChange = new EventEmitter();
    @Output() _onStatusCellChange = new EventEmitter();

    // Table
    formHeader: FormGroup;
    form: FormGroup;
    formFooter: FormGroup;

    lineFields: IKlesFieldConfig[][];
    dataSource = new MatTableDataSource<AbstractControl>([]);
    selection = new SelectionModel<AbstractControl>(this.selectionMode);

    renderedData: any[]; // data from the datasource

    displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);

    constructor(protected translate: TranslateService,
        protected adapter: DateAdapter<any>,
        private fb: FormBuilder,
        public ref: ChangeDetectorRef,
        protected dialog: MatDialog,
        public sanitizer: DomSanitizer,
        public _adapter: DateAdapter<any>,
        //@Inject('tableService') public tableService: DefaultKlesTableService
        @Inject('tableService') public tableService: AbstractKlesTableService
    ) {
        this.tableService.setTable(this);
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
    }

    ngOnInit() {
        this.dataSource.connect().subscribe(d => {
            this.renderedData = d;
        });

        this.formHeader = this.initFormHeader();
        this.formFooter = this.initFormFooter();

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
        if (changes.footer) {

        }
    }

    ngAfterViewInit() {
        // this.setDataSourceAttributes();
        // this.displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);
    }


    trackById(index: number, item: FormGroup): string {
        return `${item.value._id}`;
    }

    /** Form Header */
    initFormHeader() {
        const group = this.fb.group({});
        this.columns.forEach(column => {
            const colCellHeader = _.cloneDeep(column.headerCell);
            colCellHeader.name = column.columnDef;
            const control = this.buildControlField(colCellHeader, colCellHeader.value || '');
            control.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(e => {
                const group = control.parent;
                this._onChangeHeaderCell.emit({ column, group });
                this.tableService.onHeaderCellChange({ column, group });
            });
            group.addControl(colCellHeader.name, control);
        });

        group.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(e => {
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
        const array = this.fb.array(this._lines.map((row) => {
            return this.addFormLine(row);
        }));
        return array;
    }

    addFormLine(row): FormGroup {
        const group = this.fb.group({});
        const idControl = this.fb.control(row._id);
        const indexControl = this.fb.control(row._index);
        group.addControl('_id', idControl);
        group.addControl('_index', indexControl);
        const listField = [];
        this.columns.forEach(column => {
            column.cell.name = column.columnDef;
            const colCell = _.cloneDeep(column.cell);
            const control = this.buildControlField(colCell, row.value[colCell.name]);
            listField.push(colCell);
            control.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(e => {
                const group = control.parent;
                this.tableService.onCellChange({ column, row: { ...group.value, [colCell.name]: e }, group });
                this._onChangeCell.emit({ column, row: { ...group.value, [colCell.name]: e }, group });
            });
            control.statusChanges.pipe(takeUntil(this._onDestroy)).subscribe(status => {
                const group = control.parent;
                this.tableService.onStatusCellChange({ cell: control, group, status });
                this._onStatusCellChange.emit({ cell: control, group, status });
            });

            group.addControl(column.cell.name, control);
        });
        this.lineFields.push(listField);

        group.setValidators(this.lineValidations);
        group.setAsyncValidators(this.lineAsyncValidations);

        group.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(value => {
            this.tableService.onLineChange({ group, row, value });
        });

        group.statusChanges.subscribe(status => {
            this.tableService.onStatusLineChange({ group, row, status });
            this._onStatusLineChange.emit({ group, row, status });
        });
        return group;
    }

    public updateFormCell(index: number, cell: IKlesFieldConfig) {

        const cellIndex = this.lineFields[index].findIndex(field => field.name === cell.name);
        const column = this.columns.find(col => col.columnDef === cell.name);

        if (cellIndex >= 0 && column) {
            this.lineFields[index][cellIndex] = _.cloneDeep(cell);
            const colCell = _.cloneDeep(cell);
            const control = this.buildControlField(colCell,
                ((this.form.controls.rows as FormArray).controls[index] as FormGroup).value[cell.name] || cell.value);

            ((this.form.controls.rows as FormArray).controls[index] as FormGroup).setControl(cell.name, control);

            control.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(e => {
                const group = control.parent;
                this.tableService.onCellChange({ column, row: { ...group.value, [cell.name]: e }, group });
                this._onChangeCell.emit({ column, row: { ...group.value, [cell.name]: e }, group });
            });

            control.statusChanges.pipe(takeUntil(this._onDestroy)).subscribe(status => {
                const group = control.parent;
                this.tableService.onStatusCellChange({ cell: control, group, status });
                this._onStatusCellChange.emit({ cell: control, group, status });
            });
            this.ref.markForCheck();
        }
    }

    /** Form Footer */
    initFormFooter() {
        const group = this.fb.group({});
        this.columns
            .filter((column) => column.footerCell)
            .forEach(column => {
                const colCellFooter = column.footerCell;
                colCellFooter.name = column.columnDef;
                const control = this.buildControlField(colCellFooter, this._footer[colCellFooter.name]);
                control.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(e => {
                    const parent = control.parent;
                    const change: IChangeHeaderFooterCell = { column, group: parent };
                    this._onChangeFooterCell.emit(change);
                    this.tableService.onFooterCellChange(change);
                });
                group.addControl(colCellFooter.name, control);
            });

        group.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(e => {
            this.tableService.onFooterChange(e);
        });
        return group;
    }

    /**Field and control */
    buildControlField(field: IKlesFieldConfig, value?: any): AbstractControl {
        if (field.type === 'button') {
            return;
        }

        if (value === null) { value = ''; }

        if (field.type === 'group') {
            const subGroup = this.fb.group({});
            field.collections.forEach(subfield => {
                const control = this.fb.control(
                    subfield.value,
                    this.bindValidations(subfield.validations || []),
                    this.bindAsyncValidations(subfield.asyncValidations || [])
                );
                if (subfield.disabled) {
                    control.disable();
                }
                subGroup.addControl(subfield.name, control);
            });
            return subGroup;

        } else {
            const control = this.fb.control(
                value,
                this.bindValidations(field.validations || []),
                this.bindAsyncValidations(field.asyncValidations?.map(asyncValisation => {
                    const klesValidator = { ...asyncValisation };
                    const validatorFn = ((c: AbstractControl) => {
                        const validator$ = klesValidator.validator(c);
                        if (validator$ instanceof Promise) {
                            return validator$.finally(() => this.ref.markForCheck());
                        } else {
                            return validator$.pipe(tap(() => this.ref.markForCheck()));
                        }
                    });
                    asyncValisation.validator = validatorFn;
                    return asyncValisation;
                }) || [])
            );

            if (field.disabled) {
                control.disable();
            }

            return control;
        }
    }

    getFormArray(): FormArray {
        return (this.form.get('rows') as FormArray);
    }

    getFilterFormArray(): FormGroup[] {
        // return this.fb.array(this.renderedData);
        return this.renderedData;
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
        // return this.getFilterFormArray().controls[this.getActualIndex(index)];
        // return this.getFilterFormArray().controls[index];
        return this.getFilterFormArray()[index];
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
        this.getFormArray().valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(e => {
            // console.log('Value change on rows in form table=', e);
            //this.tableService.onLineChange(e);
        });
        this._onLoaded.emit();
        this.tableService.onDataLoaded();
    }

    updateFooter(footer: any) {
        this._footer = { ...footer };
        this.formFooter = this.initFormFooter();
    }

    updateData(lines: any[]) {
        this._lines = lines.map((l, index) => {
            const data = { ...l };
            const options = data.options;
            const _id = l._id || uuid.v4();
            const _index = index;

            delete data._id;
            delete data.options;
            return {
                _id,
                _index,
                ...options && { options },
                value: data,

            };
        });
        this.displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);
        //            this.showFooter = this.columns.some(column => column.total);
        this.setItems();
    }

    setDataSourceAttributes() {
        if (!this.hidePaginator) {
            this.dataSource.paginator = this.paginator;
        } else {
            this.dataSource.paginator = null;
        }

        if (this.sort) {
            this.dataSource.sort = this.sort;
            this.tableService.setTable(this);
            this.dataSource.sortingDataAccessor = this.tableService.getSortingDataAccessor;
            if (this.paginator && !this.hidePaginator) {
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
    // isSticky(column: KlesColumnConfig): boolean {
    //     console.log('isSticky')
    //     return column.sticky || false;
    // }

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


    public setVisible(name: string, visible: boolean): void {
        const column = this.columns.find(col => col.columnDef === name);
        if (column) {
            column.visible = visible;
        }
        this.displayedColumns = this.columns.filter(c => c.visible).map(c => c.columnDef);
        this.ref.markForCheck();
    }
}
