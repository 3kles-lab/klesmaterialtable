import { SelectionModel } from '@angular/cdk/collections';
import {
    AfterViewInit, Component, OnInit, ViewChild, EventEmitter,
    Input, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy,
    ChangeDetectorRef, Inject
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DateAdapter } from '@angular/material/core';
import { AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { KlesColumnConfig } from '../models/columnconfig.model';
import { Options } from '../models/options.model';
import { IKlesFieldConfig, IKlesValidator } from 'kles-material-dynamicforms';
import { KlesTableService } from '../services/table.service';
import { AbstractKlesTableService } from '../services/abstracttable.service';

@Component({
    selector: 'app-kles-dynamictable',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    providers: [
        {
            provide: 'tableService',
            useValue: new KlesTableService()
        }
    ],
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
    @Input() _lines: any[] = [];
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

    /** Output Component */
    @Output() _onLoaded = new EventEmitter();
    @Output() _onSelected = new EventEmitter();
    @Output() _onChangeHeaderCell = new EventEmitter();
    @Output() _onChangeCell = new EventEmitter();
    @Output() _onChangeFooterCell = new EventEmitter();
    @Output() _onStatusHeaderChange = new EventEmitter();

    // Table
    formHeader: FormGroup;
    form: FormGroup;
    lineFields: IKlesFieldConfig[][];
    formFooter: FormGroup;
    @Input() showFooter: boolean = false;
    dataSource = new MatTableDataSource<any>([]);
    selection = new SelectionModel<any>(this.selectionMode);

    displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);

    constructor(protected translate: TranslateService,
        protected adapter: DateAdapter<any>,
        private fb: FormBuilder,
        public ref: ChangeDetectorRef,
        protected dialog: MatDialog,
        public sanitizer: DomSanitizer,
        @Inject('tableService') public tableService: AbstractKlesTableService
    ) { }

    ngOnInit() {
        console.log('Table columns=', this.columns);
        this.formHeader = this.initFormHeader();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Changes!!!!');
        if (changes.columns) {
            console.warn('Changes Columns Table');
            this.columns = changes.columns.currentValue;
            this.formHeader = this.initFormHeader();
            /*this.formHeader.valueChanges.subscribe(e => {
                console.log('Header Group table value=', e);
                this.tableService.filterData();
            })*/
            this.formHeader.statusChanges.subscribe(s => {
                console.log('Header Group table state=', s);
                this._onStatusHeaderChange.emit(s)
            });
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
        this.selection.changed.subscribe(s => {
            console.log('selection table changed=', s);
        })
        console.log('Table Service=', this.tableService);
        this.tableService.setTable(this);
    }

    /** Form Header */
    initFormHeader() {
        const group = this.fb.group({});
        this.columns.forEach(column => {
            column.headerCell.name = column.columnDef;
            const control = this.buildControlField(column.cell, column.headerCell.value || '');
            control.valueChanges.subscribe(e => {
                console.log('Control headerCell change table=', e);
                const group = control.parent;
                this._onChangeHeaderCell.emit({ column, group });
            })
            console.log('Control for column name', column.headerCell.name, "=", control);
            group.addControl(column.headerCell.name, control);
        });

        group.valueChanges.subscribe(e => {
            console.log('Header Group table=', e);
            this.tableService.onHeaderChange();
        })
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
            const control = this.buildControlField(column.cell, row[column.cell.name]);
            listField.push({ ...column.cell });
            control.valueChanges.subscribe(e => {
                console.log('Control Cell change table=', e);
                const group = control.parent;
                this.tableService.onCellChange();
                this._onChangeCell.emit({ column, row, group });
            })
            console.log('Control for column name', column.cell.name, "=", control);
            group.addControl(column.cell.name, control);
        });
        this.lineFields.push(listField);
        group.valueChanges.subscribe(e => {
            console.log('Line change table=', e);
            console.log('Parent change line table=', group);
            this.tableService.onLineChange();
        })
        return group;
    }

    /** Form Footer */
    initFormFooter() {
        const group = this.fb.group({});
        this.columns.forEach(column => {
            column.footerCell.name = column.columnDef;
            const control = this.buildControlField(column.cell, column.footerCell.value || '');
            control.valueChanges.subscribe(e => {
                console.log('Control footerCell change table=', e);
                const group = control.parent;
                this._onChangeFooterCell.emit({ column, group });
            })
            console.log('Control for column name', column.footerCell.name, "=", control);
            group.addControl(column.footerCell.name, control);
        });

        group.valueChanges.subscribe(e => {
            console.log('Line change table=', e);
            console.log('Parent change line table=', group);
        })
        return group;
    }

    /**Field and control */

    buildControlField(field: IKlesFieldConfig, value?: any): FormControl {
        console.log('Column name=', field.name);
        if (field.type === 'button') {
            return;
        }
        console.log('Row=', value, ' column=', field.name);
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

    getControls(index) {
        //console.log('GetControls index=', index, "=", (this.form.get('rows') as FormArray).controls);
        //(this.form.get('rows') as FormArray).push
        //(this.form.get('rows') as FormArray).removeAt(index)
        return (this.form.get('rows') as FormArray).controls[index];
    }

    getLineFields(index, key) {
        return this.lineFields[index].find(f => f.name === key);
    }

    /**Manage Data */

    /**
* Method to set the data lines to datasource table
*/
    protected setItems() {
        this.dataSource.data = this._lines;
        this.form = this.fb.group({
            rows: this.initFormArray()
        });
        this.form.get('rows').valueChanges.subscribe(e => {
            console.log('Value change on rows in form table=', e);
            //this.tableService.onLineChange();
        })
        this._onLoaded.emit();
    }

    updateData(lines: any[]) {
        this._lines = lines;
        this.displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);
        //            this.showFooter = this.columns.some(column => column.total);
        this.setItems();
    }

    setDataSourceAttributes() {
        this.dataSource.paginator = this.paginator;
        if (this.sort) {
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = this.tableService.getSortingDataAccessor;
            if (this.paginator) {
                this.sort.sortChange.subscribe(() => {
                    this.paginator.pageIndex = 0;
                });
            }
            if (!this.sortDefault && this.sortConfig) {
                console.log('Active default sort');
                this.sort.active = this.sortConfig.active;
                this.sort.direction = this.sortConfig.direction;
                this.sort.sortChange.emit(this.sortConfig);
                this.sortDefault = !this.sortDefault;
            }
        }
    }

    public getSelectedLines(): any[] {
        return (this._lines) ? this._lines.filter(line => this.selection.isSelected(line)) : [];
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
}
