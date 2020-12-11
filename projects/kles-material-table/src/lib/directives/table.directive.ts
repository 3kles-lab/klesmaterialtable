import { ViewContainerRef, Component, Injector, ComponentFactoryResolver, ComponentRef, ReflectiveInjector, Directive, Input, Type, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { KlesTableComponent } from '../component/table.component';
import { KlesColumnConfig } from '../models/columnconfig.model';
import { KlesTableConfig } from '../models/tableconfig.model';

@Directive({
    selector: '[klesTable]'
})
export class KlesTableDirective implements OnInit, OnChanges {
    @Input() tableConfig: KlesTableConfig;
    @Input() lines: any[];

    componentRef: ComponentRef<any>;

    constructor(private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef) { }

    ngOnInit() {
        console.log('Directive KlesTable OnInit=', this.tableConfig);
        if (this.tableConfig) {
            console.log('Directive KlesTable OnInit BuildComp=', this.tableConfig);
            this.buildComponent();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('Directive KlesTable OnChanges=', changes);
        if (changes.tableConfig) {
            this.tableConfig = changes.tableConfig.currentValue;
            if (this.tableConfig) {
                this.buildComponent();
            }
        }

        if (changes.lines && this.componentRef) {
            this.lines = changes.lines.currentValue;
            this.componentRef.instance.lines = this.lines;
        }
    }

    buildComponent() {
        console.log('Directive KlesTable BuildComp=', this.tableConfig);
        const injector: Injector = ReflectiveInjector.resolveAndCreate([
            {
                provide: 'tableService',
                useValue: {
                    value: this.tableConfig.tableService
                }
            }
        ]);
        const factory = this.resolver.resolveComponentFactory(
            this.tableConfig.tableComponent || KlesTableComponent
        );
        this.componentRef = this.container.createComponent(factory, 0, injector);
        console.log(this.componentRef.instance.tableService);
        this.componentRef.instance.columns = this.tableConfig.columns;
        if (this.tableConfig.options) {
            this.componentRef.instance.options = this.tableConfig.options;
        }
        if (this.tableConfig.selectionMode) {
            this.componentRef.instance.selectionMode = this.tableConfig.selectionMode;
        }
        if (this.tableConfig.sortConfig) {
            this.componentRef.instance.sortConfig = this.tableConfig.sortConfig;
        }
        this.componentRef.instance.lines = this.lines;
    }
}
