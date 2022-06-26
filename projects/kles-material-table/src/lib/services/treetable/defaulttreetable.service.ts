import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DefaultKlesTableService } from '../defaulttable.service';
import * as uuid from 'uuid';
import { ConverterService } from './converter.service';
import { flatMap } from 'lodash';
@Injectable({
    providedIn: 'root'
})
export class DefaultKlesTreetableService extends DefaultKlesTableService {

    getDepthDataAccessor = (item: AbstractControl, property: string): number => {
        return item.value._status.depth;
    }

    getParentDataAccessor(item: FormGroup, property: string): AbstractControl {
        const [parent] = this.table.searchableTree.map(st => this.table.treeService.searchById(st, item.value._id))
            .filter(node => node.isSome())
            .flatMap(node => {
                return node.fold([], n => n.pathToRoot).slice(0, 1);
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

        const treeTable = flatMap([treeNode], this.table.treeService.flatten);

        const groups = treeTable.map((t) => {
            return this.table.addFormLine(t);
        });

        if (typeof index !== 'undefined') {
            this.table._lines.splice(index, 0, record);
            groups.forEach((group, i) => {
                this.table.getFormArray().insert(index + i, group);
            })
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

}
