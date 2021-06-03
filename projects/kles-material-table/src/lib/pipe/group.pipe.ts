import { Pipe, PipeTransform, ChangeDetectorRef, EmbeddedViewRef, Type } from '@angular/core';
import { KlesColumnConfig } from '../models/columnconfig.model';


@Pipe({
    name: 'groupPipe',
    pure: true
})
export class GroupPipe implements PipeTransform {

    private context: any;

    constructor(cdRef: ChangeDetectorRef) {
        this.context = ((cdRef as EmbeddedViewRef<Type<any>>).context);
    }

    transform(index: number): any {
        if (this.context) {
            return this.context.getControls(index);
        }
        return null;
    }
}