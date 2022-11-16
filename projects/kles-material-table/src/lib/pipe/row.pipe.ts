import { ChangeDetectorRef, EmbeddedViewRef, Pipe, PipeTransform, Type } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Pipe({
    name: 'rowPipe',
    pure: false
})
export class RowPipe implements PipeTransform {

    private context: any;

    constructor(cdRef: ChangeDetectorRef) {
        this.context = ((cdRef as EmbeddedViewRef<Type<any>>).context);
    }

    transform(row: UntypedFormGroup): any {
        if (this.context) {
            return this.context.ngClassRow(row);
        }
        return null;
    }
}
