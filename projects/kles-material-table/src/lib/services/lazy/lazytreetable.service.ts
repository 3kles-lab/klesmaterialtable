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
        // console.log('changeChildrenVisibility=', node);
        // node.controls._status.patchValue({ ...node.getRawValue()._status, children: node.getRawValue().tempChildren }, { emitEvent: false, onlySelf: true });
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
        console.log('##AddChild ', record);
        console.log('##Searchable=', this.table.searchableTree);
        // const parent = this.table.searchableTree.find(s => s._id === parentId);
        // console.log('parent', parent);
        const treeTableTree = this.table.searchableTree.map(st => this.table.converterService.toTreeTableTree(st));
        console.log('TreeTable Complete=', treeTableTree);
        const parent = treeTableTree.find(s => s._id === parentId);
        console.log('parent', parent);
        const parentDepth = ~~parent?.depth;// this.table.treeService.getNodeDepth(this.table.searchableTree, parent);
        console.log('parent depth=', parentDepth);

        if (parent) {
            const searchableNode = this.table.converterService.toSearchableTree(record);
            console.log(searchableNode)
            const treeNode = this.table.converterService.toTreeTableTree(searchableNode);
            treeNode.depth = ~~parentDepth + 1;
            console.log('treeNode', treeNode);
            const groups = this.table.createFormNode(treeNode);
            console.log('Groups=', groups);
            console.log('List FormArray=', this.table.getFormArray().controls);
            console.log('Find Index Parent=', this.table.getFormArray().controls.findIndex((group: UntypedFormGroup) => group.value._id === parentId));
            const indexParent = this.table.getFormArray().controls.findIndex((group: UntypedFormGroup) => group.value._id === parentId);
            const index = indexParent;
            + (parent.children?.length || 0);

            console.log('index', index);
            if (parent.children) {
                parent.children.push({ value: groups[0].getRawValue() });
            } else {
                parent.children = [{ value: groups[0].getRawValue() }];
            }

            this.table._lines[indexParent].children = parent.children;
            this.table._lines.splice(index + 1, 0, record);
            groups.forEach((group, i) => {
                console.log('Insert Group=', group);
                this.table.getFormArray().insert(index + (i + 1), group);
            });
            console.log('new _lines=', this.table._lines);
            // this.table.searchableTree=this.table.getFormArray().controls
            console.log('new lines control=', (this.table.getFormArray() as UntypedFormArray).controls.map(line => {
                return {
                    value: line.value,
                    _id: line.value?._id,
                    children: (line.value?._id === parentId) ? parent.children : line.value?._status?.children,
                    childrenCounter: (line.value?._id === parentId) ? ~~parent.children?.length : ~~line.value?._status?.childrenCounter,
                    isBusy: (line.value?._id === parentId) ? false : line.value?._status?.isBusy || false
                }
            }))
            this.table.searchableTree = (this.table.getFormArray() as UntypedFormArray).controls.map(line => {
                return {
                    value: (line.value?._id === parentId) ? { ...line.value, children: parent.children, childrenCounter: ~~parent.children?.length } : line.value,
                    _id: line.value?._id,
                    children: (line.value?._id === parentId) ? parent.children : line.value?._status?.children,
                    childrenCounter: (line.value?._id === parentId) ? ~~parent.children?.length : ~~line.value?._status?.childrenCounter,
                    isBusy: line.value?._status?.isBusy || false
                    // isBusy: (line.value?._id === parentId) ? false : line.value?._status?.isBusy || false
                }
            });
            // this.table.searchableTree = this.table._lines.map(t => this.table.converterService.toSearchableTree(t));

            this.updateDataSource();

            // return groups[0];
        }

        return null;
    }

    addChildren(parentId: string, record: any[]): UntypedFormGroup[] {
        return record.map(m => this.addChild(parentId, record));
    }

    deleteChild() {

    }

    deleteChildren(parentId: string) {
        console.log('##Delete Children ', parentId);
        console.log('##Searchable=', this.table.searchableTree);
        const treeTableTree = this.table.searchableTree.map(st => this.table.converterService.toTreeTableTree(st));
        console.log('TreeTable Complete=', treeTableTree);
        const parent = treeTableTree.find(s => s._id === parentId);
        console.log('parent', _.cloneDeep(parent));

        if (parent && parent.children) {
            const listChildrenId = parent.children.map(m => m.value?._id);
            console.log('Children _id to delete=', listChildrenId);
            parent.children = null;
            const indexParent = this.table.getFormArray().controls.findIndex((group: UntypedFormGroup) => group.value._id === parentId);
            this.table._lines[indexParent] = parent;
            listChildrenId.forEach(childId => {
                const index = this.table.getFormArray().controls.findIndex((group: UntypedFormGroup) => group.value._id === childId);
                this.table._lines.splice(index, 1);
                (this.table.getFormArray() as UntypedFormArray).removeAt(index, { emitEvent: false })
            });

            this.table.searchableTree = (this.table.getFormArray() as UntypedFormArray).controls.map(line => {
                return {
                    value: (line.value?._id === parentId) ? { ...line.value, children: parent.children } : line.value,
                    _id: line.value?._id,
                    children: (line.value?._id === parentId) ? parent.children : line.value?._status?.children,
                    childrenCounter: ~~line.value?._status?.childrenCounter,
                    isBusy: (line.value?._id === parentId) ? false : line.value?._status?.isBusy || false
                }
            });
            this.updateDataSource();
        }
        return null;
    }

}
