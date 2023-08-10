import { Observable } from "rxjs";

export interface IKlesDragDropTable {
    beforeDrop(event: any): Observable<boolean>;
    afterDrop(event: any): void;
    onDrop(event: any): void;
}