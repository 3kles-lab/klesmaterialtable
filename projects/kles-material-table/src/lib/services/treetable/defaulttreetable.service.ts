import { Injectable } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { DefaultKlesTableService } from '../defaulttable.service';
import { flatMap } from 'lodash';
import { isSome, fold } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
@Injectable({
    providedIn: 'root'
})
export class DefaultKlesTreetableService extends DefaultKlesTableService {

    getDepthDataAccessor = (item: AbstractControl, property: string): number => {
        return item.value._status.depth;
    }

    getParentDataAccessor(item: UntypedFormGroup, property: string): AbstractControl {
        const [parent] = this.table.searchableTree.map(st => this.table.treeService.searchById(st, item.value._id))
            .filter(node => {
                return isSome(node);
            })
            .flatMap(node => {
                return pipe(
                    node,
                    fold(() => -1, (n: any) => n.pathToRoot.length)
                );
            })
            .map(node => this.table.dataSource.data.find(row => row.value._id === node._id));
        return parent || null;
    }


    getTable() {
        return this;
    }

    getSortingDataAccessor = (item: AbstractControl, property) => {
        let value: any = item.value[property];
        if (value) {
            if (typeof value === 'string') {
                value = value.toLowerCase();
            }
            else if (typeof value === 'object') {
                if (value.key) {
                    value = value.key;
                }
            }
        }
        return value;
    };

    onLineOpen(e: any) {

    }

    onLineClose(e: any) {

    }

    onLineChange(e: any) {
        this.changeChildrenVisibility(e.group, e.group.controls._status.value.isExpanded);
        this.table.matTable.renderRows();
    }

    protected changeChildrenVisibility(node: UntypedFormGroup, visibility: boolean) {

        const paginator = node.value._status.paginator;
        const start = (paginator?.pageIndex * paginator?.pageSize) || 0;
        const end = (start + paginator?.pageSize) || node.value._status.children?.length;

        node.value._status.children?.forEach((child, index) => {
            const childGroup = this.table.getFormArray().controls.find(control => control.value._id === child._id) as UntypedFormGroup;

            if (childGroup) {
                childGroup.controls._status.patchValue({
                    isVisible: (index >= start && index < end) ? visibility : false,
                }, { emitEvent: false });
                this.changeChildrenVisibility(childGroup, childGroup.controls._status.value.isExpanded
                    && ((index >= start && index < end) ? visibility : false));
            }
        });
    }

    addRecord(record, index?: number): UntypedFormGroup {

        const searchableNode = this.table.converterService.toSearchableTree(record);
        const treeNode = this.table.converterService.toTreeTableTree(searchableNode);

        const groups = this.table.createFormNode(treeNode);

        if (typeof index !== 'undefined') {
            this.table._lines.splice(index, 0, record);
            groups.forEach((group, i) => {
                this.table.getFormArray().insert(index + i, group);
            });
        } else {
            this.table._lines.push(record);
            groups.forEach((group) => {
                this.table.getFormArray().push(group);
            });
        }
        this.table.searchableTree = this.table._lines.map(t => this.table.converterService.toSearchableTree(t));

        this.updateDataSource();

        return groups[0];
    }

    updateRow(row: any, options?: { emitEvent: boolean, onlySelf: boolean }) {
        const data = {
            ...row.value,
            _id: row._id,
            // _status: { depth: row.depth, isExpanded: row.isExpanded, isVisible: row.isVisible }
        };
        return this.updateRecord(data, options);
    }

    addChild(parentId: string, record): UntypedFormGroup {
        const treeTableTree = this.table.searchableTree.map(st => this.table.converterService.toTreeTableTree(st));
        const parent = treeTableTree.find(s => s._id === parentId);
        const parentDepth = ~~parent?.depth;
        if (parent) {
            const searchableNode = this.table.converterService.toSearchableTree(record);
            console.log(searchableNode)
            const treeNode = this.table.converterService.toTreeTableTree(searchableNode);
            treeNode.depth = ~~parentDepth + 1;
            const groups = this.table.createFormNode(treeNode);
            const indexParent = this.table.getFormArray().controls.findIndex((group: UntypedFormGroup) => group.value._id === parentId);
            const index = indexParent;
            + (parent.children?.length || 0);

            if (parent.children) {
                parent.children.push({ value: groups[0].getRawValue() });
            } else {
                parent.children = [{ value: groups[0].getRawValue() }];
            }

            this.table._lines[indexParent].children = parent.children;
            this.table._lines.splice(index + 1, 0, record);
            groups.forEach((group, i) => {
                this.table.getFormArray().insert(index + (i + 1), group);
            });
            this.table.searchableTree = (this.table.getFormArray() as UntypedFormArray).controls.map(line => {
                return {
                    value: (line.value?._id === parentId) ? { ...line.value, children: parent.children, childrenCounter: ~~parent.children?.length } : line.value,
                    _id: line.value?._id,
                    children: (line.value?._id === parentId) ? parent.children : line.value?._status?.children,
                    childrenCounter: (line.value?._id === parentId) ? ~~parent.children?.length : ~~line.value?._status?.childrenCounter,
                    isBusy: line.value?._status?.isBusy || false
                }
            });

            this.updateDataSource();
            return groups[0];
        }

        return null;
    }



    // deleteRecord(event: AbstractControl[]): void {
    //     /*TODO*/
    // }
}
