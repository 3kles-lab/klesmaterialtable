import { KlesFieldAbstract } from '@3kles/kles-material-dynamicforms';
import { UntypedFormGroup } from '@angular/forms';

export abstract class AbstractCell<T> {
    column: T;
    field: KlesFieldAbstract;
    group: UntypedFormGroup;
    siblingFields?: T[];

}
