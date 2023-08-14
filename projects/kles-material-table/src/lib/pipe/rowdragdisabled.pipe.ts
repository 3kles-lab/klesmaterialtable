import { ChangeDetectorRef, EmbeddedViewRef, Pipe, PipeTransform, Type } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";

@Pipe({
    name: 'rowDragDisabledPipe',
    pure: false
})
export class RowDragDisabledPipe implements PipeTransform {

    private context: any;

    constructor(cdRef: ChangeDetectorRef) {
        this.context = ((cdRef as EmbeddedViewRef<Type<any>>).context);
    }

    transform(row: UntypedFormGroup): any {
        if (this.context && this.context.dragDropRowsOptions.dragDisabled) {
            return this.context.dragDropRowsOptions.dragDisabled(row);
        }
        return false;
    }
}
