import { CdkDrag } from "@angular/cdk/drag-drop";
import { Observable } from "rxjs";

export interface IKlesDragDropTable {
    beforeDrop(event: any): Observable<boolean>;
    afterDrop(event: any): void;
    onDrop(event: any): void;
    sortPredicate(index: number, item: CdkDrag<any>): boolean;
}