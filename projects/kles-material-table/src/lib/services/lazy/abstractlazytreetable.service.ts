import { SafeStyle } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { KlesColumnConfig } from '../../models/columnconfig.model';
import { AbstractKlesTreeTableService } from '../treetable/abstracttreetable.service';

export abstract class AbstractKlesLazyTreetableService extends AbstractKlesTreeTableService {

    abstract load(sort: string, order: string, page: number, perPage: number, filter?: { [key: string]: any; })
        : Observable<{ lines: any[], totalCount: number, footer?: any, header?: any }>;
    abstract loadChild(parent: any, sort?: string, order?: string, page?: number, perPage?: number, filter?: { [key: string]: any; })
        : Observable<{ lines: any[], totalCount: number }>;

    abstract reload(): void;
}
