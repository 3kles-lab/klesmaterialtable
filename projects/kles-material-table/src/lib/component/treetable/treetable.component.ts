import {
    AfterViewInit, Component, OnInit, OnChanges, ChangeDetectionStrategy, SimpleChanges, Input, EventEmitter, Output, ChangeDetectorRef, Inject
} from '@angular/core';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatTreetableData } from './mat-treetable-datasource';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { flatMap } from 'lodash';
import { SearchableNode, TreeTableNode } from '../../models/node.model';
import { ConverterService } from '../../services/treetable/converter.service';
import { DefaultKlesTreetableService } from '../../services/treetable/defaulttreetable.service';
import { TreeService } from '../../services/treetable/tree.service';
import { KlesTableComponent } from '../table/table.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-kles-dynamictreetable',
    templateUrl: './treetable.component.html',
    styleUrls: ['./treetable.component.scss'],
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
        private formBuilder: FormBuilder,
        public ref: ChangeDetectorRef,
        protected dialog: MatDialog,
        public sanitizer: DomSanitizer,
        public _adapter: DateAdapter<any>,
        public treeService: TreeService,
        private converterService: ConverterService,
        @Inject('tableService') public tableService: DefaultKlesTreetableService) {
        super(translate, adapter, formBuilder, ref, dialog, sanitizer, _adapter, tableService)
    }


    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }

    updateData(lines: any[]) {
        this.updateTree(lines);
        this.displayedColumns = this.columns.filter(e => e.visible).map(c => c.columnDef);
        this.setItems();
    }

    private updateTree(data: any) {
        this._lines = Array.isArray(data) ? data : [data];
        this.searchableTree = this._lines.map(t => this.converterService.toSearchableTree(t));
    }


    initFormArray() {
        const treeTableTree = this.searchableTree.map(st => this.converterService.toTreeTableTree(st));
        const treeTable = flatMap(treeTableTree, this.treeService.flatten);

        this.lineFields = [];
        const array = this.formBuilder.array(
            // treeTableTree
            treeTable
                .map(row => {
                    return this.addFormLine(row);
                }));
        return array;
    }

    addFormLine(row: TreeTableNode<T>): FormGroup {
        const group = this.formBuilder.group({});
        const idControl = this.formBuilder.control(row._id);
        group.addControl('_id', idControl);
        const statusControl = this.formBuilder.group({
            isVisible: row.isVisible,
            isExpanded: row.isExpanded,
            depth: row.depth,
            children: [row.children]
        });

        group.addControl('_status', statusControl);


        // if (row.children) {
        //     group.addControl('_children', this.formBuilder.array(row.children.map(child => this.addFormLine(child))));
        // }

        const listField = [];
        this.columns.forEach(column => {
            column.cell.name = column.columnDef;
            console.log('TreeTable Column=', column);
            console.log('TreeTable Row=', row);
            const control = this.buildControlField(column.cell, row.value[column.cell.name]);
            listField.push({ ...column.cell });
            control.valueChanges
                .pipe(
                    debounceTime(500),
                    distinctUntilChanged((prev, curr) => {
                        if (column.cell?.property && prev && curr) {
                            return prev[column.cell.property] === curr[column.cell.property];
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
        super.setDataSourceAttributes();
        this.dataSource.table = this;
        this.dataSource.deptDataAccessor = this.tableService.getDepthDataAccessor;
        this.dataSource.parentDataAccessor = this.tableService.getParentDataAccessor;
    }



    private updateChildrensVisibility(group?: FormGroup, visible?: boolean) {
        // this.searchableTree.forEach(st => {
        //     const node = this.treeService.searchById(st, group.value._id)
        //     if (node.isSome()) {
        //         node.value.children?.forEach(child => {
        //             const childGroup = this.getFormArray().controls.find(control => control.value._id === child._id) as FormGroup;
        //             if (childGroup) {
        //                 childGroup.controls._status.patchValue({
        //                     isVisible: visible,
        //                     isExpanded: false,
        //                 });
        //             }
        //         });
        //     }
        // })

        // this.getFormArray().controls.forEach((group: FormGroup) => {

        //     const isVisible = this.searchableTree.every(st => {
        //         return this.treeService.searchById(st, group.value._id).fold([], n => n.pathToRoot)
        //             .every(p => this.getFormArray().controls.find(x => x.value._id === p._id).value._status.isExpanded);
        //     });

        //     group.controls._status.patchValue({
        //         isVisible: isVisible,
        //     });
        // });

    }

}
