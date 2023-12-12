import { IKlesFieldConfig, KlesDynamicFieldDirective, KlesFormClearComponent, componentMapper } from "@3kles/kles-material-dynamicforms";
import { Directive, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, StaticProvider, Type, ViewContainerRef } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material/core";

@Directive({
    selector: '[klesDynamicHeader]'
})
export class KlesDynamicHeaderDirective extends KlesDynamicFieldDirective implements OnInit, OnChanges, OnDestroy {
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
        if (this.componentRef) {
            this.componentRef.destroy();
        }

        const options: {
            providers: StaticProvider[];
            parent?: Injector;
            name?: string;
        } = {
            providers: this.field.dateOptions ? [
                ...(this.field.dateOptions.adapter ? [{
                    provide: DateAdapter,
                    useClass: this.field.dateOptions.adapter.class,
                    deps: this.field.dateOptions.adapter.deps || [],
                }] : []),
                { provide: MAT_DATE_LOCALE, useValue: this.field.dateOptions.language },
                { provide: MAT_DATE_FORMATS, useValue: this.field.dateOptions.dateFormat },
            ] : [],
            parent: this.i
        };

        const injector: Injector = Injector.create(options);

        this.componentRef = this.createComponentRef(injector);

        this.componentRef.instance.field = this.field;
        this.componentRef.instance.group = this.group;
        this.componentRef.instance.siblingFields = this.siblingFields;
    }

}
