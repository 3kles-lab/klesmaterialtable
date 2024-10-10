import { Pipe, PipeTransform, ChangeDetectorRef, EmbeddedViewRef, Type } from '@angular/core';
@Pipe({
  name: 'groupPipe',
  pure: true
})
export class GroupPipe implements PipeTransform {

  private context: any;

  constructor(cdRef: ChangeDetectorRef) {
    this.context = ((cdRef as EmbeddedViewRef<Type<any>>).context);
  }

  transform(index: any): any {
    if (this.context) {
      return this.context.getControls(index);
    }
    return null;
  }
}
