import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, merge, of } from 'rxjs';
import { catchError, debounceTime, startWith, switchMap, tap, distinctUntilChanged, takeUntil, filter, delay } from 'rxjs/operators';
import { TreeTableNode } from '../../models/node.model';
import { AbstractKlesLazyTreetableService } from '../../services/lazy/abstractlazytreetable.service';
import { ConverterService } from '../../services/treetable/converter.service';
import { TreeService } from '../../services/treetable/tree.service';
import { KlesTreetableComponent } from '../treetable/treetable.component';

@Component({
    selector: 'app-kles-lazytreetable',
    templateUrl: './lazytreetable.component.html',
    styleUrls: ['./lazytreetable.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class KlesLazyTreetableComponent<T> extends KlesTreetableComponent<T> implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    loading: boolean;

    filteredValues$ = new BehaviorSubject<{ [key: string]: any; }>({});

    constructor(protected translate: TranslateService,
        protected adapter: DateAdapter<any>,
        protected formBuilder: FormBuilder,
        public ref: ChangeDetectorRef,
        protected dialog: MatDialog,
        public sanitizer: DomSanitizer,
        public _adapter: DateAdapter<any>,
        public treeService: TreeService,
        public converterService: ConverterService,
        @Inject('tableService') public tableService: AbstractKlesLazyTreetableService) {
        super(translate, adapter, formBuilder, ref, dialog, sanitizer, _adapter, treeService, converterService
            , tableService);
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
        merge(this.sort.sortChange, this.paginator.page, this.filteredValues$.pipe(debounceTime(200)))
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.loading = true;
                    return this.tableService.load(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize,
                        this.filteredValues$.getValue());
                }),
                tap(() => this.loading = false),
                catchError(() => {
                    this.loading = false;
                    return of({ lines: [], totalCount: 0 });
                })
            )
            .subscribe((response) => {
                this.updateData(response.lines);
                this.paginator.length = response.totalCount;
            });

    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    getLineFields(index, key) {
        return this.lineFields[index].find(f => f.name === key);
    }

    // protected updateTree(data: any) {
    //     this._lines = Array.isArray(data) ? data : [data];
    //     this.searchableTree = this._lines.map(t => this.converterService.toSearchableTree(t));
    // }


    // initFormArray() {
    //     const treeTableTree = this.searchableTree.map(st => this.converterService.toTreeTableTree(st));
    //     // console.log('## treeTableTree=', treeTableTree);
    //     this.lineFields = [];
    //     const array = this.formBuilder.array(
    //         treeTableTree.flatMap(node => {
    //             return this.createFormNode(node);
    //         })
    //     );
    //     return array;
    // }

    createFormNode(node: TreeTableNode<any>): FormGroup[] {
        let children: FormGroup[] = [];
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


    addFormLine(row: TreeTableNode<T>): FormGroup {
        const group = this.formBuilder.group({});
        const idControl = this.formBuilder.control(row._id);
        group.addControl('_id', idControl);

        const lazyChildControl = this.formBuilder.control(row.isExpanded);
        group.addControl('_lazyChild', lazyChildControl);

        const statusControl = this.formBuilder.group({
            isVisible: row.isVisible,
            isExpanded: row.isExpanded,
            depth: row.depth,
            childrenCounter: row.childrenCounter || ~~row.children?.length,
            children: [row.children],
            isBusy: false,
        });

        group.addControl('_status', statusControl);
        statusControl.valueChanges.pipe(
            filter(f => f.isExpanded !== lazyChildControl.value),
            tap(t => {
                statusControl.patchValue({ isBusy: true }, { emitEvent: false });
                lazyChildControl.patchValue(t.isExpanded, { emitEvent: false });
                return t;
            }),
            switchMap(s => {
                // console.log('Status change=', s, "=> group=", group.getRawValue()._status);
                if (s.isExpanded) {
                    // console.log('Load Children group=>', group);
                    // const child = { ...group.getRawValue().tempChildren[0] }
                    // this.tableService.addChild(group.getRawValue()._id, child);
                    return this.tableService.loadChild(group);
                } else {
                    // console.log('Delete Children');
                    return of([]);
                }
            })

        ).subscribe(listChildren => {
            console.log('Result OnClick Child=', listChildren);
            if (listChildren.length) {
                console.log('###CHILD');
                listChildren.forEach(child => this.tableService.addChild(row._id, child));
                // console.log('###CHILDREN');
                // this.tableService.addChildren(row._id, s);
                // statusControl.patchValue({ children: s }, { emitEvent: false, onlySelf: true });
                // console.log('Update Row=', { _id: group.getRawValue()._id, value: { ...group.getRawValue(), children: s } });
                // this.tableService.updateRow({ _id: group.getRawValue()._id, value: { ...group.getRawValue(), Warehouse: 'toto', children: s }, children: s }, { emitEvent: false, onlySelf: true });
                // console.log('Lines=', this._lines)
                // const currentIndex = this._lines.findIndex(f => f?.value?._id === group.getRawValue()._id);
                // console.log('Index to update=', currentIndex);
                // let filterLines = this._lines.filter(f => f?.value?._id !== group.getRawValue()?._id);
                // console.log('List Filter=', filterLines);
                // const record = { _id: group.getRawValue()._id, value: { ...group.getRawValue() }, children: s as any };
                // filterLines.splice(currentIndex, 0, record);
                // this._lines = filterLines;
                // this.updateData(this._lines);
            } else {
                this.tableService.deleteChildren(row._id);
            }
            // statusControl.patchValue({ isBusy: false }, { emitEvent: false, onlySelf: true });
            statusControl.patchValue({ children: listChildren, isBusy: false }, { emitEvent: false });
            console.log('Statuscontrol Result=', statusControl);
            console.log('List FormArray Result=', this.getFormArray());
            // (this.getFormArray().controls.find((group: FormGroup) => group.value._id === row._id) as FormGroup)
            //     .controls._status.patchValue({ isBusy: false }, { emitEvent: false });
            this.ref.markForCheck();
        })


        // if (row.children) {
        //     group.addControl('_children', this.formBuilder.array(row.children.map(child => this.addFormLine(child))));
        // }
        const listField = [];
        this.columns.forEach(column => {
            column.cell.name = column.columnDef;
            const control = this.buildControlField(column.cell, row.value[column.cell.name]);
            listField.push({ ...column.cell });
            control.valueChanges
                .pipe(
                    debounceTime(column.cell.debounceTime || 0),
                    distinctUntilChanged((prev, curr) => {
                        if (Array.isArray(prev) && Array.isArray(curr)) {
                            if (column.cell?.property) {
                                return prev.length === curr.length
                                    && prev.every((value, index) => value[column.cell.property] === curr[index][column.cell.property]);
                            } else {
                                return prev.length === curr.length && prev.every((value, index) => value === curr[index]);
                            }
                        } else {
                            if (column.cell?.property && prev && curr) {
                                return prev[column.cell.property] === curr[column.cell.property];
                            }
                        }
                        return prev === curr;
                    }))
                .subscribe(e => {
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
