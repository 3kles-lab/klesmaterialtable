import { KlesDynamicFieldDirective } from '@3kles/kles-material-dynamicforms';
import { Directive, OnInit, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { KlesLeafComponent } from '../component/treetable/cell/leaf.component';
import { KlesNodeComponent } from '../component/treetable/cell/node.component';
import { KlesTreeColumnConfig } from '../models/columnconfig.model';


@Directive({
    selector: '[klesDynamicTreeCell]'
})
export class KlesDynamicTreeCellDirective extends KlesDynamicFieldDirective implements OnInit, OnChanges, OnDestroy {

    @Input() column: KlesTreeColumnConfig;
    @Input() row: UntypedFormGroup;

    ngOnInit() {
        this.buildComponent();
    }


    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    buildComponent() {
        if (this.componentRef) { this.componentRef.destroy(); }

        this.componentRef = this.container.createComponent(this.column.canExpand ? KlesNodeComponent : KlesLeafComponent);
        this.componentRef.instance.field = this.field;
        this.componentRef.instance.group = this.group;
        this.componentRef.instance.row = this.row;
        this.componentRef.instance.column = this.column;
    }
}
