import { ChangeDetectorRef, EmbeddedViewRef, Optional, Pipe, PipeTransform, Self, Type } from '@angular/core';
import { KlesTableComponent } from '../component/table.component';
import { KlesColumnConfig } from '../models/columnconfig.model';

@Pipe({
    name: 'fieldPipe',
    pure: true
})
export class FieldPipe implements PipeTransform {

    private context: any;

    constructor(cdRef: ChangeDetectorRef) {
        this.context = ((cdRef as EmbeddedViewRef<Type<any>>).context);
    }

    transform(column: KlesColumnConfig, index: number): any {
        if (this.context) {
            return this.context.getLineFields(index, column.cell.name);
        }
        return null;
    }
}
