import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnChanges, OnDestroy, OnInit, Signal, SimpleChanges, signal } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { BehaviorSubject, Subject, concat, merge, of } from 'rxjs';
import { catchError, debounceTime, switchMap, tap, take, takeUntil, filter, map } from 'rxjs/operators';
import { TreeTableNode } from '../../models/node.model';
import { AbstractKlesLazyTreetableService } from '../../services/lazy/abstractlazytreetable.service';
import { ConverterService } from '../../services/treetable/converter.service';
import { TreeService } from '../../services/treetable/tree.service';
import { KlesTreetableComponent } from '../treetable/treetable.component';
import { rowsAnimation } from '../../animations/row.animation';
import { KlesTreeColumnConfig } from '../../models/columnconfig.model';

@Component({
    selector: 'app-kles-lazytreetable',
    templateUrl: './lazytreetable.component.html',
    styleUrls: ['./lazytreetable.component.scss', '../../styles/dragdrop.scss', '../../styles/align-cell.scss', '../../styles/input.scss'],
    animations: [rowsAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class KlesLazyTreetableComponent<T> extends KlesTreetableComponent<T> implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    loading = signal(false);
    reload$ = new Subject<void>();
    filteredValues$ = new BehaviorSubject<{ [key: string]: any; }>({});

    constructor(protected translate: TranslateService,
        protected adapter: DateAdapter<any>,
        protected formBuilder: UntypedFormBuilder,
        public ref: ChangeDetectorRef,
        protected dialog: MatDialog,
        public sanitizer: DomSanitizer,
        public _adapter: DateAdapter<any>,
        public treeService: TreeService,
        public converterService: ConverterService,
        @Inject('tableService') public tableService: AbstractKlesLazyTreetableService,
        protected _elementRef: ElementRef) {
        super(translate, adapter, formBuilder, ref, dialog, sanitizer, _adapter, treeService, converterService
            , tableService, _elementRef);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

        merge(this.sort.sortChange, this.filteredValues$.pipe(debounceTime(500)), this.reload$)
            .subscribe(() => this.paginator.pageIndex = 0);

        merge(this.reload$, this.sort.sortChange, this.paginator.page, this.filteredValues$.pipe(debounceTime(500)))
            .pipe(
                takeUntil(this._onDestroy),
                switchMap(() => {
                    return concat(
                        of({ loading: true, value: { lines: [], totalCount: 0, footer: {}, header: {} } }),
                        this.tableService.load(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize,
                            this.filteredValues$.getValue()).pipe(
                                map(value => ({ loading: false, value })),
                                catchError((err) => {
                                    console.error(err);
                                    return of({ loading: false, value: { lines: [], totalCount: 0, footer: {}, header: {} } });
                                })
                            )
                    );
                })
            )
            .subscribe((response) => {
                if (response.loading) {
                    this.loading.set(true);
                } else {
                    this.loading.set(false);

                    if (this.showFooter && response.value.footer) {
                        this.formFooter.patchValue(response.value.footer);
                    }
                    if (response.value.header) {
                        this.formHeader.patchValue(response.value.header, { emitEvent: false });
                    }

                    this.updateData(response.value.lines);
                    this.paginator.length = response.value.totalCount;
                }
                // this.ref.markForCheck();
            });

    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    getLineFields(index, key) {
        return this.lineFields[index].find(f => f.name === key);
    }

    createFormNode(node: TreeTableNode<any>): UntypedFormGroup[] {
        let children: UntypedFormGroup[] = [];
        const parent = this.addFormLine(node);
        if (node.children) {
            children = node.children.flatMap(child => {
                const childControls = this.createFormNode(child);
                childControls.filter(control => control.value._status.depth === parent.value._status.depth + 1)
                    .forEach((control) => {
                        control.valueChanges
                            .pipe(
                                takeUntil(this._onDestroy))
                            .subscribe((value) => {
                                const v = { ...value };
                                delete v._id;
                                delete v._status;

                                const data = {
                                    value: v,
                                    ...(value._status.children && { children: value._status.children }),
                                    childrenCounter: value._status.childrenCounter || ~~value._status?.children?.length,
                                    depth: value._status.depth,
                                    isExpanded: value._status.isExpanded,
                                    isVisible: value._status.isVisible,
                                    isBusy: value._status.isBusy || false,
                                    _id: value._id,
                                };

                                parent.controls._status
                                    .patchValue({
                                        children:
                                            parent.controls._status.value.children
                                                .filter(c => c._id !== value._id)
                                                .concat(data)
                                    });
                            });
                    });
                return childControls;
            });
        }
        return [parent, ...children];
    }


    addFormLine(row: TreeTableNode<T>): UntypedFormGroup {
        const group = this.formBuilder.group({});
        const idControl = this.formBuilder.control(row._id);
        const unfoldControl = this.fb.control(row._unfold || false);
        group.addControl('_id', idControl);
        group.addControl('_unfold', unfoldControl);

        const paginator = (this.columns as Signal<KlesTreeColumnConfig[]>)().find(c => c.paginator && c.canExpand);

        const statusControl = this.formBuilder.group({
            isVisible: row.isVisible,
            isExpanded: row.isExpanded,
            depth: row.depth,
            childrenCounter: row.childrenCounter || ~~row.children?.length,
            children: [row.children],
            isBusy: false,
            ...(paginator && {
                paginator: this.formBuilder.group({
                    pageIndex: 0,
                    pageSize: paginator.paginatorOption?.pageSize || this.paginator?.pageSize || 5,
                    length: 0
                })
            })
        });
        group.addControl('_status', statusControl);

        merge(statusControl.controls.paginator?.valueChanges || of(), statusControl.controls.isExpanded.valueChanges)
            .pipe(
                takeUntil(this._onDestroy),
                switchMap(() => {
                    if (statusControl.controls.isExpanded.value) {
                        return concat(
                            of({ loading: true, value: { lines: [], totalCount: 0 } }),
                            this.tableService.loadChild(group, this.sort.active, this.sort.direction, statusControl.controls.paginator?.value.pageIndex,
                                statusControl.controls.paginator?.value.pageSize, this.filteredValues$.getValue()).pipe(
                                    map(value => ({ loading: false, value })),
                                    catchError((err) => {
                                        console.error(err);
                                        return of({ loading: false, value: { lines: [], totalCount: 0 } });
                                    })
                                )
                        );
                    }
                    return of({ loading: false, value: { lines: [], totalCount: 0 } })

                })
            ).subscribe(({ loading, value }) => {
                if (!loading) {
                    this.tableService.deleteChildren(row._id);
                    if (value.lines.length) {
                        value.lines.forEach(child => this.tableService.addChild(row._id, child));
                    }
                    statusControl.controls.paginator?.patchValue({ length: value.totalCount }, { emitEvent: false });
                }
                statusControl.patchValue({ isBusy: loading }, { emitEvent: false });

                this.ref.markForCheck();
            })

        const rowValue = row.value;
        const listField = [];
        this.columns().forEach(column => {
            column.cell.name = column.columnDef;
            const colCell = _.cloneDeep(column.cell);
            const control = this.buildControlField(colCell, rowValue[colCell.name]);
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
                this.tableService.onCellChange({ column, row, group, response: e.response });
                this._onChangeCell.emit({ column, row, group, response: e.response });
            });
            control.statusChanges.pipe(takeUntil(this._onLinesChanges)).subscribe(status => {
                const group = control.parent;
                this.tableService.onStatusCellChange({ cell: control, group, status });
                this._onStatusCellChange.emit({ cell: control, group, status });
            });

            group.addControl(column.cell.name, control);
        });
        this.lineFields.push(listField);

        group.setValidators(this.lineValidations);
        group.setAsyncValidators(this.lineAsyncValidations);

        group.valueChanges.pipe(
            takeUntil(this._onDestroy)
        ).subscribe(value => {
            this.tableService.onLineChange({ group, row, value });
        });

        group.statusChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(status => {
                this.tableService.onStatusLineChange({ group, row, status });
                this._onStatusLineChange.emit({ group, row, status });
            });
        return group;
    }

    setDataSourceAttributes() {
        if (this.sort) {
            if (this.paginator && !this.hidePaginator) {
                this.sort.sortChange.subscribe(() => {
                    this.paginator.pageIndex = 0;
                });
            }
            if (
                // !this.sortDefault && 
                this.sortConfig) {
                this.sort.active = this.sortConfig.active;
                this.sort.direction = this.sortConfig.direction;
                this.sort.sortChange.emit(this.sortConfig);
                // this.sortDefault = !this.sortDefault;
            }
        }
        this.tableService.setTable(this);
        this.dataSource.table = this;
        this.dataSource.deptDataAccessor = this.tableService.getDepthDataAccessor;
        this.dataSource.parentDataAccessor = this.tableService.getParentDataAccessor;
    }
}
