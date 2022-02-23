import { IKlesFieldConfig } from '@3kles/kles-material-dynamicforms';
import { Directive, Input, OnInit, ComponentFactoryResolver, ViewContainerRef, ComponentRef, Type, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
    selector: '[klesComponentHeader]'
})
export class KlesComponentHeaderDirective implements OnInit, OnChanges {
    @Input() component: Type<any>;
    @Input() value: any;
    @Input() group?: FormGroup;
    @Input() field?: IKlesFieldConfig;


    componentRef: ComponentRef<any>;

    constructor(private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef) { }

    ngOnInit() {
        this.buildComponent();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.component && !changes.component.isFirstChange()) {
            this.component = changes.component.currentValue;
            this.buildComponent();
        }
        if (changes.value && !changes.value.isFirstChange()) {
            this.value = changes.value.currentValue;
            this.componentRef.instance.value = this.value;
        }
    }

    buildComponent() {
        const factory = this.resolver.resolveComponentFactory(
            this.component
        );
        if (this.componentRef) this.componentRef.destroy();
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.component = this.component;
        this.componentRef.instance.value = this.value;
        this.componentRef.instance.field = this.field;
        this.componentRef.instance.group = this.group;
    }
}
