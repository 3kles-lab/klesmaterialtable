import { Injectable } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { DefaultKlesTableService } from "../defaulttable.service";

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
        if(value){
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
}
