import { Directive, EventEmitter, Output, SimpleChanges } from "@angular/core";
import { KlesTableDirective } from "./table.directive";

@Directive({
    selector: '[klesTreetable]'
})
export class KlesTreetableDirective extends KlesTableDirective {

    @Output() _onLineOpen = new EventEmitter();
    @Output() _onLineClose = new EventEmitter();

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    buildComponent() {
        super.buildComponent();
        this.componentRef.instance._onLineOpen = this._onLineOpen;
        this.componentRef.instance._onLineClose = this._onLineClose;

    }
}