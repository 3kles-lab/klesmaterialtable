import {
    AfterViewInit, Component, OnInit, OnChanges, ChangeDetectionStrategy, SimpleChanges, Input, EventEmitter, Output, ChangeDetectorRef, Inject
} from '@angular/core';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatTreetableData } from './mat-treetable-datasource';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { SearchableNode, TreeTableNode } from '../../models/node.model';
import { ConverterService } from '../../services/treetable/converter.service';
import { TreeService } from '../../services/treetable/tree.service';
import { KlesTableComponent } from '../table/table.component';
import { debounceTime, switchMap, take, catchError, takeUntil, map, tap } from 'rxjs/operators';
import { AbstractKlesTreeTableService } from '../../services/treetable/abstracttreetable.service';
import { of, combineLatest } from 'rxjs';
import { rowsAnimation } from '../../animations/row.animation';
import { KlesTreeColumnConfig } from '../../models/columnconfig.model';
import * as uuid from 'uuid';

@Component({
    selector: 'app-kles-dynamictreetable',
    templateUrl: './treetable.component.html',
    styleUrls: ['./treetable.component.scss'],
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

export class KlesTreetableComponent<T> extends KlesTableComponent {


    @Output() _onLineOpen = new EventEmitter();
    @Output() _onLineClose = new EventEmitter();

    searchableTree: SearchableNode<T>[];

    dataSource = new MatTreetableData<AbstractControl>([]);

    constructor(protected translate: TranslateService,
        protected adapter: DateAdapter<any>,
        protected formBuilder: UntypedFormBuilder,
        public ref: ChangeDetectorRef,
        protected dialog: MatDialog,
        public sanitizer: DomSanitizer,
        public _adapter: DateAdapter<any>,
        public treeService: TreeService,
        public converterService: ConverterService,
        @Inject('tableService') public tableService: AbstractKlesTreeTableService) {
        super(translate, adapter, formBuilder, ref, dialog, sanitizer, _adapter, tableService);
    }


    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
    }

    updateData(lines: any[]) {
        this.updateTree(lines);
        this.displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);
        this.setItems();
    }

    protected updateTree(data: any) {
        this._lines = (Array.isArray(data) ? data : [data]).map((line => {
            return { _id: uuid.v4(), ...line, }
        }));
        this.searchableTree = this._lines.map(t => this.converterService.toSearchableTree(t));
    }


    initFormArray() {
        const treeTableTree = this.searchableTree.map(st => this.converterService.toTreeTableTree(st));
        this.lineFields = [];
        const array = this.formBuilder.array(
            treeTableTree.flatMap(node => {
                return this.createFormNode(node);
            })
        );
        return array;
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
                                // delete value._id;
                                // delete value._status;
                                const v = { ...value };
                                delete v._id;
                                delete v._status;

                                const data = {
                                    value: v,
                                    ...(value._status.children && { children: value._status.children }),
                                    childrenCounter: ~~value._status?.children?.length,
                                    depth: value._status.depth,
                                    isExpanded: value._status.isExpanded,
                                    isVisible: value._status.isVisible,
                                    _id: value._id
                                };

                                parent.controls._status
                                    .patchValue({
                                        children:
                                            parent.controls._status.value.children.map((c => {
                                                if (c._id === data._id) {
                                                    return data;
                                                }
                                                return c;
                                            }))

                                    }, { emitEvent: false });
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
        group.addControl('_id', idControl);

        const paginator = (this.columns as KlesTreeColumnConfig[]).find(c => c.paginator && c.canExpand);

        const statusControl = this.formBuilder.group({
            parentId: row.parentId,
            isVisible: row.isVisible,
            isExpanded: row.isExpanded,
            depth: row.depth,
            children: [row.children],
            childrenCounter: row.childrenCounter || ~~row.children?.length,
            ...(paginator && {
                paginator: this.formBuilder.group({
                    pageIndex: 0,
                    pageSize: paginator.paginatorOption?.pageSize || 5,
                    length: row.childrenCounter || ~~row.children?.length || 0
                })
            })
        });

        group.addControl('_status', statusControl);

        const rowValue = row?.value;
        const listField = [];
        this.columns.forEach(column => {
            column.cell.name = column.columnDef;
            const colCell = _.cloneDeep(column.cell);
            const control = this.buildControlField(colCell, rowValue[colCell.name]);
            listField.push({ ...column.cell });
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
                // distinctUntilChanged((prev, curr) => {
                //     if (Array.isArray(prev) && Array.isArray(curr)) {
                //         if (column.cell?.property) {
                //             return prev.length === curr.length
                //                 && prev.every((value, index) => value[column.cell.property] === curr[index][column.cell.property]);
                //         } else {
                //             return prev.length === curr.length && prev.every((value, index) => value === curr[index]);
                //         }
                //     } else {
                //         if (column.cell?.property && prev && curr) {
                //             return prev[column.cell.property] === curr[column.cell.property];
                //         }
                //     }
                //     return prev === curr;
                // })
            ).subscribe(e => {
                const group = control.parent;
                this.tableService.onCellChange({ column, row, group, response: e.response });
                this._onChangeCell.emit({ column, row, group, response: e.response });
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


    setDataSourceAttributes() {
        super.setDataSourceAttributes();
        this.dataSource.table = this;
        this.dataSource.deptDataAccessor = this.tableService.getDepthDataAccessor;
        this.dataSource.parentDataAccessor = this.tableService.getParentDataAccessor;
    }
}
