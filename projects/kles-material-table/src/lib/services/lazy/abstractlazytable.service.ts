import { Observable } from "rxjs";
import { AbstractKlesTableService } from "../abstracttable.service";

export abstract class AbstractKlesLazyTableService extends AbstractKlesTableService {

    abstract load(sort: string, order: string, page: number, perPage: number): Observable<{lines: any[], totalCount:number}>
}