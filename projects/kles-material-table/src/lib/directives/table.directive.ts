import { ViewContainerRef, Component, Injector, ComponentFactoryResolver, ComponentRef, ReflectiveInjector, Directive, Input, Type, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { KlesTableComponent } from '../component/table.component';
import { KlesTableConfig } from '../models/tableconfig.model';

@Directive({
    selector: '[klesTable]'
})
export class KlesTableDirective implements OnInit, OnChanges {
    @Input() tableConfig: KlesTableConfig;
    @Input() lines: any[];

    @Output() _onLoaded = new EventEmitter();
    @Output() _onSelected = new EventEmitter();
    @Output() _onChangeHeaderCell = new EventEmitter();
    @Output() _onChangeCell = new EventEmitter();
    @Output() _onChangeFooterCell = new EventEmitter();
    @Output() _onStatusHeaderChange = new EventEmitter();

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
        const options = {
            providers: [{
                provide: 'tableService',
                useValue: this.tableConfig.tableService
            }]
        }
        const injector: Injector = Injector.create(options);
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
        if (this.tableConfig.hidePaginator) {
            this.componentRef.instance.hidePaginator = this.tableConfig.hidePaginator;
        }
        if (this.tableConfig.pageSize) {
            this.componentRef.instance.pageSize = this.tableConfig.pageSize;
        }
        if (this.tableConfig.pageSizeOptions) {
            this.componentRef.instance.pageSizeOptions = this.tableConfig.pageSizeOptions;
        }
        this.componentRef.instance.lines = this.lines;

        this.componentRef.instance._onChangeHeaderCell = this._onChangeHeaderCell;
        this.componentRef.instance._onChangeCell = this._onChangeCell;
        this.componentRef.instance._onChangeFooterCell = this._onChangeFooterCell;
    }
}
