import { Observable } from 'rxjs';

export interface ISelection {
    select?: (selected: boolean) => Observable<{ selected: boolean; indeterminate: boolean }>;
    selectAll?: (selected: boolean) => Observable<{ selected: boolean; indeterminate: boolean }>;
}
