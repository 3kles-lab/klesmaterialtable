import { SelectionModel } from '@angular/cdk/collections';
import {
    AfterViewInit, Component, OnInit, ViewChild, EventEmitter,
    Input, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy,
    ChangeDetectorRef, Inject, OnDestroy, Type
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { AbstractControl, AsyncValidatorFn, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { KlesColumnConfig } from '../../models/columnconfig.model';
import { Options } from '../../models/options.model';
import { Node } from '../../models/node.model';
import { componentMapper, IKlesFieldConfig, klesFieldControlFactory } from '@3kles/kles-material-dynamicforms';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import { catchError, debounceTime, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { IChangeCell, IChangeHeaderFooterCell, IDropRow, IKlesCellFieldConfig } from '../../models/cell.model';
import { AbstractKlesTableService } from '../../services/abstracttable.service';
import { of, Subject } from 'rxjs';
import { rowsAnimation } from '../../animations/row.animation';

import { CdkDragDrop, CdkDrag } from '@angular/cdk/drag-drop';


@Component({
    selector: 'app-kles-dynamictable',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss', '../../styles/dragdrop.scss', '../../styles/align-cell.scss'],
    animations: [rowsAnimation],
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
    public paginator: MatPaginator;
    public sort: MatSort;
    protected sortDefault = false;

    protected _onDestroy = new Subject<void>();
    protected _onLinesChanges = new Subject<void>();

    @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
        if (!this.sort) {
            this.sort = ms;
            this.setDataSourceAttributes();
        }
    }

    @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
        if (!this.paginator) {
            this.paginator = mp;
            this.setDataSourceAttributes();
        }
    }

    @ViewChild(MatTable) matTable: MatTable<any>;

    /** Input Component */
    @Input() id: string;

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
    @Input() set selectionMode(selectionMode: boolean) {
        this.selection = new SelectionModel<any>(selectionMode);
    }
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
    @Input() dragDropRows: boolean = false;
    @Input() dragDropRowsOptions: any = { autoScrollStep: 5 };

    @Input() lineValidations: ValidatorFn[];
    @Input() lineAsyncValidations: AsyncValidatorFn[];

    @Input() ngClassRow: (row: UntypedFormGroup) => any = ((row) => ({ 'highlight-on-hover': this.options.highlightRowOnHover }));

    @Input() multiTemplate: boolean = false;
    @Input() templates: { cells: IKlesCellFieldConfig[], when?: ((index: number, rowData: any) => boolean) }[] = [];
    @Input() templateUnfold: { cells: IKlesCellFieldConfig[], multiUnfold?: boolean; disabled?: (row: UntypedFormGroup) => boolean; };

    /** Output Component */
    @Output() _onLoaded = new EventEmitter();
    @Output() _onSelected = new EventEmitter<AbstractControl[]>();
    @Output() _onChangeHeaderCell = new EventEmitter<IChangeHeaderFooterCell>();
    @Output() _onChangeCell = new EventEmitter<IChangeCell>();
    @Output() _onChangeFooterCell = new EventEmitter<IChangeHeaderFooterCell>();
    @Output() _onStatusHeaderChange = new EventEmitter();
    @Output() _onStatusLineChange = new EventEmitter();
    @Output() _onStatusCellChange = new EventEmitter();
    @Output() _onClick = new EventEmitter();
    @Output() _onDragDropRow = new EventEmitter<IDropRow>();

    // Table
    formHeader: UntypedFormGroup;
    form: UntypedFormGroup;
    formFooter: UntypedFormGroup;

    lineFields: IKlesFieldConfig[][];
    dataSource = new MatTableDataSource<AbstractControl>([]);
    selection = new SelectionModel<AbstractControl>(true);

    renderedData: any[]; // data from the datasource

    displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);

    constructor(protected translate: TranslateService,
        protected adapter: DateAdapter<any>,
        protected fb: UntypedFormBuilder,
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
        this._onLinesChanges.next();
        this._onDestroy.next();
        this._onLinesChanges.complete();
        this._onDestroy.complete();
    }

    ngOnInit() {
        this.dataSource.connect().subscribe(d => {
            this.renderedData = d;
        });

        this.formHeader = this.initFormHeader();
        this.formFooter = this.initFormFooter();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log('changes', changes);
        // if (changes.columns) {
        //     this.columns = changes.columns.currentValue;
        //     this.formHeader = this.initFormHeader();
        // }
        // if (changes.lines) {
        //     this.updateData(changes.lines.currentValue);
        // }
        // if (changes.selectionMode) {
        //     this.selectionMode = changes.selectionMode.currentValue;
        //     this.selection = new SelectionModel<any>(this.selectionMode);
        // }
        // if (changes.footer) {

        // }
    }

    ngAfterViewInit() {
        this.matTable?.updateStickyColumnStyles();
    }


    trackById(index: number, item: UntypedFormGroup): any {
        return item;
    }

    /** Form Header */
    initFormHeader() {
        const group = this.fb.group({});
        this.columns.forEach(column => {
            const colCellHeader = _.cloneDeep(column.headerCell);
            colCellHeader.name = column.columnDef;
            const control = this.buildControlField(colCellHeader, colCellHeader.value || '');
            control.valueChanges.pipe(takeUntil(this._onDestroy),
                debounceTime(colCellHeader.debounceTime || 0)
            ).subscribe(e => {
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
        this._onLinesChanges.next();
        const array = this.fb.array(this._lines.map((row) => {
            return this.addFormLine(row);
        }));
        return array;
    }

    addFormLine(row): UntypedFormGroup {
        const group = this.fb.group({});
        const idControl = this.fb.control(row._id);
        const indexControl = this.fb.control(row._index);
        const unfoldControl = this.fb.control(row._unfold || false);
        group.addControl('_id', idControl);
        group.addControl('_index', indexControl);
        group.addControl('_unfold', unfoldControl);
        const listField = [];
        this.columns.forEach(column => {
            column.cell.name = column.columnDef;
            const colCell = _.cloneDeep(column.cell);
            const control = this.buildControlField(colCell, row.value[colCell.name]);
            listField.push(colCell);
            control.valueChanges.pipe(
                takeUntil(this._onLinesChanges),
                debounceTime(colCell.debounceTime || 0),
                switchMap((value) => {
                    if (colCell.executeAfterChange) {
                        colCell.pending = true;
                        this.ref.markForCheck();
                        return colCell.executeAfterChange(colCell.name,
                            { ...control?.parent.value, [colCell.name]: value }, control?.parent)
                            .pipe(
                                take(1),
                                catchError((err) => {
                                    console.error(err);
                                    return of(null);
                                }),
                                map((response) => ({ value, response })),
                                tap(() => {
                                    colCell.pending = false;
                                    this.ref.markForCheck();
                                })
                            );
                    }
                    return of({ value, response: null });
                })
            ).subscribe(e => {
                const group = control.parent;
                this.tableService.onCellChange({ column, row: { ...group.value, [colCell.name]: e.value }, group, response: e.response });
                this._onChangeCell.emit({ column, row: { ...group.value, [colCell.name]: e.value }, group, response: e.response });
            });
            control.statusChanges.pipe(takeUntil(this._onLinesChanges)).subscribe(status => {
                const group = control.parent;
                this.tableService.onStatusCellChange({ cell: control, group, status });
                this._onStatusCellChange.emit({ cell: control, group, status });
            });

            group.addControl(column.cell.name, control);
        });
        this.lineFields.push(listField);

        if (this.multiTemplate) {
            if (this.templateUnfold) {
                this.templateUnfold.cells.forEach((cell) => {
                    const field: IKlesCellFieldConfig = _.cloneDeep(cell);
                    const control = this.buildControlField(field, row.value[cell.name]);
                    group.addControl(cell.name, control);
                })
            }
            if (this.templates?.length) {
                this.templates.forEach(template => {
                    template.cells.forEach((cell) => {
                        const field: IKlesCellFieldConfig = _.cloneDeep(cell);
                        const control = this.buildControlField(field, row.value[cell.name]);
                        group.addControl(cell.name, control);
                    })

                });
            }
        }

        group.setValidators(this.lineValidations);
        group.setAsyncValidators(this.lineAsyncValidations);

        group.valueChanges.pipe(takeUntil(this._onLinesChanges)).subscribe(value => {
            this.tableService.onLineChange({ group, row, value });
        });

        group.statusChanges.subscribe(status => {
            this.tableService.onStatusLineChange({ group, row, status });
            this._onStatusLineChange.emit({ group, row, status });
        });
        return group;
    }

    public updateFormCell(index: number, cell: IKlesCellFieldConfig) {
        const cellIndex = this.lineFields[index].findIndex(field => field.name === cell.name);
        const column = this.columns.find(col => col.columnDef === cell.name);

        const group = ((this.form.controls.rows as UntypedFormArray).controls
            .find((c: UntypedFormGroup) => c.controls._index.value === index));

        if (cellIndex >= 0 && column && group) {
            this.lineFields[index][cellIndex] = _.cloneDeep(cell);
            const colCell = _.cloneDeep(cell);

            const control = this.buildControlField(colCell, group.value[cell.name] || cell.value);

            (group as UntypedFormGroup).setControl(cell.name, control);

            control.valueChanges.pipe(takeUntil(this._onLinesChanges),
                debounceTime(colCell.debounceTime || 0),
                switchMap((value) => {
                    if (colCell.executeAfterChange) {
                        colCell.pending = true;
                        this.ref.markForCheck();
                        return colCell.executeAfterChange(colCell.name,
                            { ...control?.parent.value, [colCell.name]: value }, control?.parent)
                            .pipe(
                                take(1),
                                catchError((err) => {
                                    console.error(err);
                                    return of(null);
                                }),
                                map((response) => ({ value, response })),
                                tap(() => {
                                    colCell.pending = false;
                                    this.ref.markForCheck();
                                })
                            );
                    }
                    return of({ value, response: null });
                }))
                // distinctUntilChanged((prev, curr) => {
                //     if (column.cell?.property && prev && curr) {
                //         return prev[column.cell.property] === curr[column.cell.property];
                //     }
                //     return prev === curr;
                // }))
                .subscribe(e => {
                    const parent = control.parent;
                    this.tableService.onCellChange({ column, row: { ...parent.value, [cell.name]: e.value }, group: parent, response: e.response });
                    this._onChangeCell.emit({ column, row: { ...parent.value, [cell.name]: e.value }, group: parent, response: e.response });
                });

            control.statusChanges.pipe(takeUntil(this._onLinesChanges)).subscribe(status => {
                const parent = control.parent;
                this.tableService.onStatusCellChange({ cell: control, group: parent, status });
                this._onStatusCellChange.emit({ cell: control, group: parent, status });
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

        const asyncValidations = field.asyncValidations?.map(asyncValisation => {
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
        }) || [];


        if (field.type) {
            return componentMapper.find(c => c.type === field.type)?.factory({ ...field, value, asyncValidations }) || klesFieldControlFactory({ ...field, value, asyncValidations });
        } else {
            return componentMapper.find(c => c.component === field.component)?.factory({ ...field, value, asyncValidations }) || klesFieldControlFactory({ ...field, value, asyncValidations });
        }
    }

    getFormArray(): UntypedFormArray {
        return (this.form.get('rows') as UntypedFormArray);
    }

    getFilterFormArray(): UntypedFormGroup[] {
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
        // return this.lineFields[this.getActualIndex(index)].find(f => f.name === key);
        return this.lineFields[index].find(f => f.name === key);
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
            const _unfold = l._unfold || false;
            const _index = index;

            delete data._id;
            delete data.options;
            return {
                _id,
                _unfold,
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

    getFooterStyle(column: KlesColumnConfig): SafeStyle {
        return this.tableService.getFooterStyle(column);
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

    public pageChanged(event: PageEvent) {
        this.tableService.onPageChange(event);
    }

    public getTemplateColumns(template: any): string[] {
        return template.cells.map(c => c.name);
    }

    public onClick(row: UntypedFormGroup) {
        this._onClick.emit(row);
        this.tableService.onClick(row);
    }

    public drop(event: CdkDragDrop<UntypedFormGroup[]>) {
        this.tableService.drop(event);
    }

    public sortPredicate() {
        return ((index: number, item: CdkDrag<number>) => {
            return this.tableService?.getSortPredicate(index, item);
        })
    }
}
