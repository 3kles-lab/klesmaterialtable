import { Observable, of } from "rxjs";
import { KlesDragDropRowTableService } from "./dragdroprow.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { UntypedFormGroup } from "@angular/forms";
import { take } from "rxjs/operators";

export class KlesDragDropRowTreeTableService extends KlesDragDropRowTableService {
    beforeDrop(event: any): Observable<boolean> {
        const rowDrop = event.item.data;

        const row = this.table.getFormArray().controls[event.currentIndex];

        return of(row.value._status.depth === rowDrop.value._status.depth && row.value._status.parentId === rowDrop.value._status.parentId)
    }

    public onDrop(event: CdkDragDrop<UntypedFormGroup[]>) {
        this.beforeDrop(event).pipe(take(1)).subscribe((isValid) => {
            if (isValid) {
                const previousIndex = this.table.getFormArray().controls.findIndex((d) => d.value._id === event.item.data.value._id);

                const currentIndex = event.previousIndex < event.currentIndex ?
                    this.findIndexLastChild(this.table.getFormArray().controls[event.currentIndex] as UntypedFormGroup)
                    : event.currentIndex;

                moveItemInArray(this.table.getFormArray().controls, previousIndex, currentIndex);
                this.moveChildren(this.table.getFormArray().controls[currentIndex] as UntypedFormGroup, currentIndex);
                this.table.dataSource.data = this.table.getFormArray().controls;
                this.afterDrop(event);
            }
        })
    }

    private moveChildren(parent: UntypedFormGroup, index: number): number {
        parent?.controls._status.value.children?.forEach((child) => {
            const previousIndex = this.table.getFormArray().controls.findIndex((group: UntypedFormGroup) => group.controls._id.value === child._id);
            if (previousIndex !== -1) {
                if (previousIndex > index) {
                    index++;
                }
                moveItemInArray(this.table.getFormArray().controls, previousIndex, index);
                index = this.moveChildren(this.table.getFormArray().controls[index] as UntypedFormGroup, index);
            }
        })
        return index;
    }

    private findIndexLastChild(parent: UntypedFormGroup): number {
        if (!parent.controls._status.value.children) {
            return null;
        }

        return Math.max(...parent.controls._status.value.children?.map((child) => {
            return this.table.getFormArray().controls.findIndex((group: UntypedFormGroup) => group.controls._id.value === child._id);
        }))
    }

}