import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

export interface ISelection {
    select?: (selected: boolean, group: FormGroup) => Observable<{ selected: boolean; indeterminate: boolean }>;
    selectAll?: (selected: boolean, filters: { [key: string]: any }) => Observable<{ selected: boolean; indeterminate: boolean }>;
}
