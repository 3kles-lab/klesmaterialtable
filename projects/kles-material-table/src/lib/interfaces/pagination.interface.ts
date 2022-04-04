import { Observable } from 'rxjs';

export interface IPagination {
    list<T>(sort: string, order: string, page: number, perPage: number, filter?: { [key: string]: any; }):
        Observable<{ lines: T[], totalCount: number }>;
}
