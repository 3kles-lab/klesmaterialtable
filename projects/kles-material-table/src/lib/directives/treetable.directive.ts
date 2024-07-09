import { Directive, EventEmitter, Output, SimpleChanges } from "@angular/core";
import { KlesTableDirective } from "./table.directive";
import { KlesTreeTableConfig } from "../models/treetableconfig.model";
import { Input } from "@angular/core";

@Directive({
  selector: '[klesTreetable]'
})
export class KlesTreetableDirective extends KlesTableDirective {
  @Input() tableConfig: KlesTreeTableConfig;

  @Output() _onLineOpen = new EventEmitter();
  @Output() _onLineClose = new EventEmitter();

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  buildComponent() {
    if (this.tableConfig.deleteOffset) {
      this.tableConfig.columns = this.tableConfig.columns.map((m) => ({
        ...m,
        deleteOffset: this.tableConfig.deleteOffset
      }));
    }
    super.buildComponent();
    this.componentRef.instance._onLineOpen = this._onLineOpen;
    this.componentRef.instance._onLineClose = this._onLineClose;

  }
}
