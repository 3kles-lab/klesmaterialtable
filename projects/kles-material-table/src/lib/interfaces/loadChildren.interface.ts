import { Observable } from 'rxjs';

export interface ILoadChildren {
    loadChildren<T>(parentId: any, sort?: string, order?: string, page?: number, perPage?: number, filter?: { [key: string]: any; }):
        Observable<{ lines: T[], totalCount: number }>;
}