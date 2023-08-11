


import { UntypedFormGroup } from "@angular/forms";
import { KlesTableComponent } from "../../../component/table/table.component";
import { KlesTableBaseService } from "../tableservice.interface";
import { CdkDrag, CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { IKlesDragDropTable } from "./dragdrop.interface";
import { Observable, of } from "rxjs";
import { take } from "rxjs/operators";

export class KlesDragDropRowTableService implements KlesTableBaseService, IKlesDragDropTable {
    table: KlesTableComponent;

    public beforeDrop(event: any): Observable<boolean> {
        return of(true);
    }

    public onDrop(event: CdkDragDrop<UntypedFormGroup[]>) {
        this.beforeDrop(event).pipe(take(1)).subscribe((isValid) => {
            if (isValid) {
                const previousIndex = this.table.getFormArray().controls.findIndex((d) => d.value._id === event.item.data.value._id);
                moveItemInArray(this.table.getFormArray().controls, previousIndex, event.currentIndex);
                this.table._onDragDropRow.emit({
                    currentIndex: event.currentIndex, previousIndex: previousIndex,
                    group: this.table.getFormArray().controls[event.currentIndex] as UntypedFormGroup
                });
                this.table.dataSource.data = this.table.getFormArray().controls;
                this.afterDrop(event);
            }
        })
    }

    public afterDrop(event: any) {

    }

    public sortPredicate(index: number, item: CdkDrag<UntypedFormGroup>): boolean {
        return true;
    }
}