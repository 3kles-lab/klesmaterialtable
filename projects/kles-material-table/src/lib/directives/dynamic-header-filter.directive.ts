import { IKlesFieldConfig, KlesDynamicFieldDirective, KlesFormClearComponent, componentMapper } from "@3kles/kles-material-dynamicforms";
import { Directive, Injector, Input, OnChanges, OnDestroy, OnInit, Provider, SimpleChanges, StaticProvider, Type, ViewContainerRef } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material/core";
import { Options } from "../models/options.model";

@Directive({
    selector: '[klesDynamicHeaderFilter]',
    standalone: false
})
export class KlesDynamicHeaderFilterDirective extends KlesDynamicFieldDirective implements OnInit, OnChanges, OnDestroy {
    @Input() field: IKlesFieldConfig;
    @Input() group: UntypedFormGroup;
    @Input() siblingFields: IKlesFieldConfig[];

    constructor(container: ViewContainerRef, private i: Injector) {
        super(container, i)
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }

    buildComponent() {
        super.buildComponent();
        const element = (this.componentRef?.location.nativeElement as HTMLElement);
        element?.classList.add('full-size');
    }

}
