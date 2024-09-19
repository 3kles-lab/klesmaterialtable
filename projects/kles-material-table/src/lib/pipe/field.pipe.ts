import { ChangeDetectorRef, EmbeddedViewRef, Pipe, PipeTransform, Type } from '@angular/core';
import { KlesColumnConfig } from '../models/columnconfig.model';

@Pipe({
  name: 'fieldPipe',
  pure: false
})
export class FieldPipe implements PipeTransform {

  private context: any;

  constructor(cdRef: ChangeDetectorRef) {
    this.context = ((cdRef as EmbeddedViewRef<Type<any>>).context);
  }

  // transform(column: KlesColumnConfig, index: number): any {
  //     if (this.context) {
  //         return this.context.getLineFields(index, column.cell.name);
  //     }
  //     return null;
  // }
  transform(column: KlesColumnConfig, _id: any): any {
    if (this.context) {
      return this.context.getLineFields(_id, column.cell.name);
    }
    return null;
  }
}
