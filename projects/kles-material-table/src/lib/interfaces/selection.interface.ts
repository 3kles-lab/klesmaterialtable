import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

export interface ISelection {
    select?: (selected: boolean, group: UntypedFormGroup, filters?: { [key: string]: any }) => Observable<{ selected: boolean; indeterminate: boolean, footer?: any }>;
    selectAll?: (selected: boolean, filters: { [key: string]: any }) => Observable<{ selected: boolean; indeterminate: boolean, footer?: any }>;
}
