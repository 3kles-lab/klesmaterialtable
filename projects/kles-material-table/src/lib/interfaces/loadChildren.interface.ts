import { Observable } from 'rxjs';

export interface ILoadChildren {
    loadChildren<T>(parentId: any):
        Observable<{ lines: T[], totalCount: number }>;
}