import { SelectionModel } from '@angular/cdk/collections';
import {
    AfterViewInit, Component, OnInit, ViewChild, EventEmitter,
    Input, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy,
    ChangeDetectorRef,
    Type,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DateAdapter } from '@angular/material/core';
//import * as _moment from 'moment';
import { AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ColumnConfig } from '../models/column.model';
//import { IModelError } from '@app/material-app/shared/models';
import { Options } from '../models';
import { IFieldConfig, IValidator } from 'kles-material-dynamicforms';

@Component({
    selector: 'app-kles-dynamictable',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableComponent implements OnInit, OnChanges, AfterViewInit {
    protected paginator: MatPaginator;
    protected sort: MatSort;

    @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }

    /** Input Component */
    @Input() _lines: any[] = [];
    @Input() set lines(lines: any | any[]) {
        // const oldTree = _.cloneDeep(this._tree);
        //this._lines = lines;
        //const oldSelection = _.cloneDeep(this.selection.selected);
        this.updateData(lines);
    }

    @Input() columns = [] as ColumnConfig[];
    @Input() selectionMode = true;
    @Input() options: Options<any> = {
        verticalSeparator: true,
        capitalisedHeader: true,
        highlightRowOnHover: true,
        elevation: 5
    };

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
    lineFields: IFieldConfig[][];
    formFooter: FormGroup;
    dataSource = new MatTableDataSource<any>([]);
    selection = new SelectionModel<any>(this.selectionMode);

    displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);

    constructor(protected translate: TranslateService, protected adapter: DateAdapter<any>,
        private fb: FormBuilder,
        public ref: ChangeDetectorRef,
        protected dialog: MatDialog,
        public sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        //this.updateData(this._lines);
        /*this.form = this.fb.group({
            rows: this.fb.array([])
        });
        this.form.get('rows').valueChanges.subscribe(e => {
            console.log('Value change on rows in form table=', e);
        })
        */
        console.log('Table columns=', this.columns);
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Changes!!!!');
        if (changes.columns) {
            console.warn('Changes Columns Table');
            this.columns = changes.columns.currentValue;
            this.formHeader = this.initFormHeader();
            this.formHeader.statusChanges.subscribe(s => this._onStatusHeaderChange.emit(s));
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
        //this.showFooter = this.columns.some(column => column.total);
    }

    formatElevation(): string {
        return `mat-elevation-z${this.options.elevation}`;
    }

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
        })
        this._onLoaded.emit();
    }

    updateData(lines: any[]) {
        //this.updateLines();
        this._lines = lines;
        this.displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);
        //            this.showFooter = this.columns.some(column => column.total);
        this.setItems();
    }

    /** Form Header */
    initFormHeader() {
        const group = this.fb.group({});
        this.columns.forEach(column => {
            column.headerCell.name = column.columnDef;
            console.log('Column name=', column.headerCell.name);
            if (column.headerCell.type === 'button') {
                return;
            }
            console.log('Header column=', column.headerCell.name);
            const control = this.fb.control(
                column.headerCell.value || '',
                this.bindValidations(column.headerCell.validations || []),
                this.bindAsyncValidations(column.headerCell.asyncValidations || [])
            );
            if (column.headerCell.disabled) {
                control.disable();
            }
            control.valueChanges.subscribe(e => {
                console.log('Control headerCell change table=', e);
                const parent = control.parent;
                this._onChangeHeaderCell.emit({ column, parent });
            })
            console.log('Control for column name', column.headerCell.name, "=", control);
            group.addControl(column.headerCell.name, control);
        });

        group.valueChanges.subscribe(e => {
            console.log('Line change table=', e);
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
            console.log('Column name=', column.cell.name);
            if (column.cell.type === 'button') {
                return;
            }
            console.log('Row=', row[column.cell.name], ' column=', column.cell.name);
            const control = this.fb.control(
                row[column.cell.name] || '',
                this.bindValidations(column.cell.validations || []),
                this.bindAsyncValidations(column.cell.asyncValidations || [])
            );
            if (column.cell.disabled) {
                control.disable();
            }
            listField.push({ ...column.cell });
            control.valueChanges.subscribe(e => {
                console.log('Control Cell change table=', e);
                const parent = control.parent;
                this._onChangeCell.emit({ column, parent });
            })
            console.log('Control for column name', column.cell.name, "=", control);
            group.addControl(column.cell.name, control);
        });
        this.lineFields.push([...listField]);
        group.valueChanges.subscribe(e => {
            console.log('Line change table=', e);
            console.log('Parent change line table=', group);
        })
        return group;
    }

    /** Form Footer */
    initFormFooter() {
        const group = this.fb.group({});
        this.columns.forEach(column => {
            column.footerCell.name = column.columnDef;
            console.log('Column name=', column.footerCell.name);
            if (column.footerCell.type === 'button') {
                return;
            }
            console.log('Header column=', column.footerCell.name);
            const control = this.fb.control(
                column.footerCell.name || '',
                this.bindValidations(column.footerCell.validations || []),
                this.bindAsyncValidations(column.footerCell.asyncValidations || [])
            );
            if (column.footerCell.disabled) {
                control.disable();
            }
            control.valueChanges.subscribe(e => {
                console.log('Control footerCell change table=', e);
                const parent = control.parent;
                this._onChangeFooterCell.emit({ column, parent });
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

    getControls(index) {
        //console.log('GetControls index=', index, "=", (this.form.get('rows') as FormArray).controls);
        //(this.form.get('rows') as FormArray).push
        //(this.form.get('rows') as FormArray).removeAt(index)
        return (this.form.get('rows') as FormArray).controls[index];
    }

    getLineFields(index, key) {
        return this.lineFields[index].find(f => f.name === key);
    }

    protected bindValidations(validations: IValidator<ValidatorFn>[]): ValidatorFn {
        if (validations.length > 0) {
            const validList = [];
            validations.forEach(valid => {
                validList.push(valid.validator);
            });
            return Validators.compose(validList);

        }
        return null;
    }

    protected bindAsyncValidations(validations: IValidator<AsyncValidatorFn>[]): AsyncValidatorFn {
        if (validations.length > 0) {
            const validList = [];
            validations.forEach(valid => {
                validList.push(valid.validator);
            });
            return Validators.composeAsync(validList);

        }
        return null;
    }

    setDataSourceAttributes() {
        this.dataSource.paginator = this.paginator;
        if (this.sort) {
            this.dataSource.sort = this.sort;
            if (this.paginator) {
                this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
            }
        }
    }

    /** Table rendering */

    /**
     * Method to rendering cell color
     * @param row
     * @param column
     */
    /*getCellStyle(row: any, column: ColumnConfig): SafeStyle {
        const style = 'text-align: center; background-color: ';
        if (row.error) {
            if (row.error.filter((e: IModelError) => e.key === column.columnDef && e.level === 'error').length > 0) {
                return 'lightcoral';
            } else if (row.error.filter(e => e.key === column.columnDef && e.level === 'warn').length > 0) {
                return 'lightyellow';
            }
        }
        return this.sanitizer.bypassSecurityTrustStyle(style);
    }*/

    /**
     * Method to check if column is sticky
     * @param column
     */
    isSticky(column: ColumnConfig): boolean {
        return column.sticky || false;
    }

    /**Table Selection */
    isAllSelected() {
        const numSelected = this.selection.selected
            .filter(s => this.dataSource.filteredData.includes(s)).length;
        // const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.filteredData.length;
        // const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.dataSource.filteredData.forEach(row => {
                this.selection.deselect(row);
                // this._onSelected.emit(row);
            })
            // this.selection.clear()
            :
            this.dataSource.filteredData.forEach(row => {
                this.selection.select(row);
                // this._onSelected.emit(row);
            });
        this._onSelected.emit(this.selection.selected);
    }

    changeSelectLine(row) {
        console.log('changeSelectLine for row=', row);
        if (row) {
            this.selection.toggle(row);
            // if (this.selection.isSelected(row)) {
            // this._onSelected.emit(row);
            // }
            this._onSelected.emit(this.selection.selected);
        }
    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    public getSelectedLines(): any[] {
        return (this._lines) ? this._lines.filter(line => this.selection.isSelected(line)) : [];
    }

    addRecord(record) {
        record = { beginvalue: 35, envalue: 100, color: '#CCCCCC' };
        this._lines.push(record);
        this.dataSource.data = this._lines;

        (this.form.get('rows') as FormArray).push(this.addFormLine(record));
    }

    deleteRecord(record) {
        record = { beginvalue: 35, endvalue: 50, color: '#CCCCCC' };
        this.lines.push(record);
        (this.form.get('rows') as FormArray).push(this.addFormLine(record));
    }
}
