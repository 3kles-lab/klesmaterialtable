import { Observable } from 'rxjs';
import { AbstractKlesTreeTableService } from '../treetable/abstracttreetable.service';

export abstract class AbstractKlesLazyTreetableService extends AbstractKlesTreeTableService {

    abstract load(sort: string, order: string, page: number, perPage: number, filter?: { [key: string]: any; })
        : Observable<{ lines: any[], totalCount: number }>;
}
