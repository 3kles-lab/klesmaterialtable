import { Observable } from "rxjs";

export interface IPagination {
    list<T>(sort: string, order: string, page: number, perPage: number): Observable<{ lines: T[], totalCount: number }>;
}
