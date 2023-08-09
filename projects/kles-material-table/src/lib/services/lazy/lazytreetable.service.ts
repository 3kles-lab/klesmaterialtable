import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { SafeStyle } from '@angular/platform-browser';
import * as _ from 'lodash';
import { classes } from 'polytype';
import { Observable } from 'rxjs';
import { ILoadChildren } from '../../interfaces/loadChildren.interface';
import { IPagination } from '../../interfaces/pagination.interface';
import { ISelection } from '../../interfaces/selection.interface';
import { KlesColumnConfig } from '../../models/columnconfig.model';
import { DefaultKlesTableService } from '../defaulttable.service';
import { KlesSelectionTableService } from '../features/selection/selectiontable.service';
import { KlesSelectionTableLazyService } from '../features/selection/selectiontablelazy.service';
import { DefaultKlesTreetableService } from '../treetable/defaulttreetable.service';
import { isSome, fold } from 'fp-ts/lib/Option';
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function';

export class KlesLazyTreetableService extends classes(DefaultKlesTreetableService, KlesSelectionTableLazyService) {

    constructor(private data: IPagination, private child: ILoadChildren, selection?: ISelection) {
        super
            (
                { super: KlesSelectionTableLazyService, arguments: ['#select', selection] },
            );

    }

    //Header 
    onHeaderChange(e: any) {
        this.table.filteredValues$.next(this.table.formHeader.value);
    }
    onHeaderCellChange(e: any) {
        this.changeSelectionHeader(e);
    }

    //Line
    onCellChange(e: any) {
        this.changeSelectionLine(e);
    }

    onLineChange(e: any) {
        // super.onLineChange(e);
    }

    protected changeChildrenVisibility(node: UntypedFormGroup, visibility: boolean) {
        node.value._status.children?.forEach(child => {
            const childGroup = this.table.getFormArray().controls.find(control => control.value._id === child._id) as UntypedFormGroup;
            if (childGroup) {
                childGroup.controls._status.patchValue({
                    isVisible: visibility,
                }, { emitEvent: false });
                this.changeChildrenVisibility(childGroup, childGroup.controls._status.value.isExpanded && visibility);
            }
        });
    }

    //Footer
    onFooterChange(e: any) { }

    onPageChange(event: PageEvent) {
        // super.onPageChange(event);
    }

    load(sort: string, order: string, page: number, perPage: number, filter?: { [key: string]: any; }):
        Observable<{ lines: any[], totalCount: number, footer?: any, header?: any }> {
        return this.data.list(sort, order, page, perPage, filter);
    }

    loadChild(parentId: string, sort?: string, order?: string, page?: number, perPage?: number, filter?: { [key: string]: any; }): Observable<{ lines: any[], totalCount: number }> {
        return this.child.loadChildren(parentId, sort, order, page, perPage, filter);
    }

    addChild(parentId: string, record): UntypedFormGroup {
        const searchableParent = this.table.searchableTree.map(s => {
            return this.table.treeService.getById(s, parentId)
        })?.[0];

        if (searchableParent) {
            const searchableNode = this.table.converterService.toSearchableTree(record);
            searchableParent.children ? searchableParent.children.push(searchableNode) : searchableParent.children = [searchableNode];

            const treeTableTree = this.table.searchableTree.map(st => this.table.converterService.toTreeTableTree(st));

            const treeTableParent = this.table.treeService.flatten(treeTableTree.find(s => {
                return this.table.treeService.searchById(s, parentId)
            })).find(row => row._id === parentId);

            const treeNode = this.table.converterService.toTreeTableTree(searchableNode);
            treeNode.depth = ~~treeTableParent.depth + 1;

            const groups = this.table.createFormNode(treeNode);

            const parentIndex = this.table.getFormArray().controls.findIndex((group: UntypedFormGroup) => group.value._id === parentId);

            this.table.getFormArray().controls[parentIndex].controls._status.patchValue({
                children: (this.table.getFormArray().controls[parentIndex].controls._status.value.children || []).concat([treeNode]),
                childrenCounter: (this.table.getFormArray().controls[parentIndex].controls._status.value.children?.length || 0) + 1
            }, { emitEvent: false });

            groups.forEach((group, index) => {
                this.table.getFormArray().insert(parentIndex + index + 1, group);
            });

            this.updateDataSource();
            return groups[0];
        }
    }


    addChildren(parentId: string, record: any[]): UntypedFormGroup[] {
        return record.map(m => this.addChild(parentId, record));
    }


    deleteRow(rowId: string) {
        const row = this.table.getFormArray().controls.find((group: UntypedFormGroup) => group.value._id === rowId);
        if (row) {
            row.controls._status.value.children?.forEach((child) => {
                this.deleteRow(child._id);
            });

            const parentId = row.controls._status.value.parentId;
            if (parentId) {
                const parent: UntypedFormGroup = this.table.getFormArray().controls.find((group: UntypedFormGroup) => group.value._id === parentId);
                if (parent) {
                    parent.controls._status.patchValue({ children: parent.controls._status.value.children.filter(c => c._id !== rowId) }, { emitEvent: false });
                }
            }

            const index = this.table.getFormArray().controls.findIndex((group: UntypedFormGroup) => group.value._id === rowId);
            if (index !== -1) {
                this.table.getFormArray().removeAt(index);
            }

            this.table.searchableTree = this.table.searchableTree.filter(searchableNode => searchableNode._id !== rowId);
        }
    }

    deleteChildren(parentId: string) {
        const parent = this.table.getFormArray().controls.find((group: UntypedFormGroup) => group.value._id === parentId);
        if (parent?.controls._status.controls.children?.value) {
            parent?.controls._status.controls.children?.value?.forEach((child) => {
                this.deleteRow(child._id);
            });

            parent?.controls._status.patchValue({ children: [] }, { emitEvent: false });

            const searchableParent = this.table.searchableTree.map(s => {
                return this.table.treeService.getById(s, parentId)
            })?.[0];

            if (searchableParent) {
                searchableParent.children = [];
            }

            this.updateDataSource();
        }

    }

}
