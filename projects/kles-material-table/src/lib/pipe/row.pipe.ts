import { ChangeDetectorRef, EmbeddedViewRef, Pipe, PipeTransform, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
    name: 'rowPipe',
    pure: false
})
export class RowPipe implements PipeTransform {

    private context: any;

    constructor(cdRef: ChangeDetectorRef) {
        this.context = ((cdRef as EmbeddedViewRef<Type<any>>).context);
    }

    transform(row: FormGroup): any {
        if (this.context) {
            return this.context.ngClassRow(row);
        }
        return null;
    }
}
