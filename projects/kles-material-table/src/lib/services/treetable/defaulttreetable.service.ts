import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
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

    getParentDataAccessor(item: FormGroup, property: string): AbstractControl {
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

    onLineOpen(e: any) { }

    onLineClose(e: any) { }

    onLineChange(e: any) {
        this.changeChildrenVisibility(e.group, e.group.controls._status.value.isExpanded);
    }

    private changeChildrenVisibility(node: FormGroup, visibility: boolean) {
        node.value._status.children?.forEach(child => {
            const childGroup = this.table.getFormArray().controls.find(control => control.value._id === child._id) as FormGroup;

            if (childGroup) {
                childGroup.controls._status.patchValue({
                    isVisible: visibility,
                }, { emitEvent: false });
                this.changeChildrenVisibility(childGroup, childGroup.controls._status.value.isExpanded && visibility);
            }
        });
    }

    addRecord(record, index?: number): FormGroup {

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

    addChild(parentId: string, record): FormGroup {
        /*TODO*/
        // console.log(this.table.searchableTree);
        // const parent = this.table.searchableTree.find(s => s._id === parentId);

        // console.log('parent', parent);

        // if (parent) {
        //     const searchableNode = this.table.converterService.toSearchableTree(record);
        //     console.log(searchableNode)
        //     const treeNode = this.table.converterService.toTreeTableTree(searchableNode);
        //     treeNode.depth = 1;
        //     console.log('treeNode', treeNode);
        //     const groups = this.table.createFormNode(treeNode);

        //     const index = this.table.getFormArray().controls.findIndex((group: FormGroup) => group.value._id === parentId)
        //         + (parent.children.length || 0);

        //     if (parent.children) {
        //         parent.children.push(record);
        //     } else {
        //         parent.children = [record];
        //     }


        //     console.log('index', index);

        //     this.table._lines.splice(index, 0, record);
        //     groups.forEach((group, i) => {
        //         this.table.getFormArray().insert(index + i, group);
        //     });
        //     this.table.searchableTree = this.table._lines.map(t => this.table.converterService.toSearchableTree(t));

        //     this.updateDataSource();

        //     return groups[0];
        // }

        return null;
    }


    // deleteRecord(event: AbstractControl[]): void {
    //     /*TODO*/
    // }
}
