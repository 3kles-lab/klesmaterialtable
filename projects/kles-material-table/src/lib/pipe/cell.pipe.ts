import { ChangeDetectorRef, EmbeddedViewRef, Pipe, PipeTransform, Type } from '@angular/core';
import { KlesColumnConfig } from '../models/columnconfig.model';

@Pipe({
    name: 'cellPipe',
})
export class CellPipe implements PipeTransform {

    private context: any;

    constructor(cdRef: ChangeDetectorRef) {
        this.context = ((cdRef as EmbeddedViewRef<Type<any>>).context);
    }

    transform(column: KlesColumnConfig): any {
        return {
            'vertical-separator': this.context?.options?.verticalSeparator,
            ...(column.align && { ['align-' + column.align]: true })
        };
    }
}
