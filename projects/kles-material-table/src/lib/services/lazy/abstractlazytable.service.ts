import { Observable } from 'rxjs';
import { AbstractKlesTableService } from '../abstracttable.service';

export abstract class AbstractKlesLazyTableService extends AbstractKlesTableService {

    abstract load(sort: string, order: string, page: number, perPage: number, filter?: { [key: string]: any; })
        : Observable<{ lines: any[], totalCount: number, footer?: any, header?: any }>;
}
