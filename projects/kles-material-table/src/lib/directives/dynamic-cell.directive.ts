import { KlesDynamicFieldDirective } from '@3kles/kles-material-dynamicforms';
import { Directive, OnInit, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { KlesColumnConfig } from '../models/columnconfig.model';
import { KlesUnfoldCellComponent } from '../component/cell/unfoldcell.component';


@Directive({
    selector: '[klesDynamicCell]'
})
export class KlesDynamicCellDirective extends KlesDynamicFieldDirective implements OnInit, OnChanges, OnDestroy {

    @Input() column: KlesColumnConfig;
    @Input() config?: any;

    ngOnInit() {
        super.ngOnInit();
    }


    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    buildComponent() {
        if (this.column.canUnfold) {
            if (this.componentRef) { this.componentRef.destroy(); }
            this.componentRef = this.container.createComponent(KlesUnfoldCellComponent);
            this.componentRef.instance.field = this.field;
            this.componentRef.instance.group = this.group;
            this.componentRef.instance.siblingFields = this.siblingFields;
            this.componentRef.instance.disabled = this.config?.templateUnfold?.disabled;
        } else {
            super.buildComponent();
        }
    }
}
