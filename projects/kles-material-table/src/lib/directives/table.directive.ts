import { EnumType, KlesFormColorComponent, KlesFormDateComponent, KlesFormInputClearableComponent, KlesFormSelectSearchComponent } from '@3kles/kles-material-dynamicforms';
import { ViewContainerRef, Injector, ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KlesFormDynamicHeaderFilterComponent } from '../../public-api';
import { KlesTableConfig } from '../models/tableconfig.model';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Directive({
    selector: '[klesTable]'
})
export class KlesTableDirective implements OnInit, OnChanges {
    @Input() tableConfig: KlesTableConfig;
    @Input() lines: any[];
    @Input() footer: any;

    @Output() _onLoaded = new EventEmitter();
    @Output() _onSelected = new EventEmitter();
    @Output() _onChangeHeaderCell = new EventEmitter();
    @Output() _onChangeCell = new EventEmitter();
    @Output() _onChangeFooterCell = new EventEmitter();
    @Output() _onStatusHeaderChange = new EventEmitter();

    @Output() _onClick = new EventEmitter();

    componentRef: ComponentRef<any>;

    constructor(private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef) { }

    ngOnInit() {
        // console.log('Directive KlesTable OnInit=', this.tableConfig);
        // if (this.tableConfig) {
        //     console.log('Directive KlesTable OnInit BuildComp=', this.tableConfig);
        //     this.buildComponent();
        // }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tableConfig) {
            this.tableConfig = changes.tableConfig.currentValue;
            if (this.tableConfig) {
                this.buildComponent();
                if (!changes.lines && !this.componentRef.instance.lines) {
                    this.lines = [];
                    this.componentRef.instance.lines = [];
                }
            }
        }

        if (changes.lines && this.componentRef) {
            this.lines = changes.lines.currentValue;
            this.componentRef.instance.lines = this.lines;
        }

        if (changes.footer && this.componentRef) {
            this.footer = changes.footer.currentValue;
            this.componentRef.instance.footer = this.footer;
        }
    }

    buildComponent() {
        const options = {
            providers: [
                {
                    provide: 'tableService',
                    useValue: this.tableConfig.tableService
                },
                ...this.tableConfig.customMatPaginatorIntl ? [{
                    provide: MatPaginatorIntl,
                    useClass: this.tableConfig.customMatPaginatorIntl
                }] : []
            ]
        };
        const injector: Injector = Injector.create(options);
        const factory = this.resolver.resolveComponentFactory(
            this.tableConfig.tableComponent
        );

        if (this.componentRef) {
            this.componentRef.destroy();
        }

        this.componentRef = this.container.createComponent(factory, 0, injector);

        this.componentRef.instance.columns = signal(this.tableConfig.columns.map(m => {
            const obj = { ...m };
            obj.headerCell.filterable = obj.filterable;
            obj.headerCell.sortable = obj.sortable;

            if ((obj.filterable || obj.headerCell.filterable) && !obj.headerCell.component && obj.headerCell.type) {
                obj.headerCell.component = KlesFormDynamicHeaderFilterComponent;
                switch (obj.headerCell.type) {
                    case EnumType.date:
                        obj.headerCell.filterComponent = KlesFormDateComponent;
                        break;
                    case EnumType.color:
                        obj.headerCell.filterComponent = KlesFormColorComponent;
                        break;
                    case EnumType.list:
                        obj.headerCell.filterComponent = KlesFormInputClearableComponent;
                        obj.headerCell.autocomplete = true;
                        obj.headerCell.options = new BehaviorSubject<any[]>([]);
                        break;
                    case EnumType.multi:
                        obj.headerCell.filterComponent = KlesFormSelectSearchComponent;
                        obj.headerCell.autocomplete = true;
                        obj.headerCell.options = new BehaviorSubject<any[]>([]);
                        obj.headerCell.multiple = true;
                        break;
                    default:
                        obj.headerCell.filterComponent = KlesFormInputClearableComponent;
                        obj.headerCell.inputType = obj.headerCell.type;
                        break;

                }
            }

            return obj;
        }));
        if (this.tableConfig.options) {
            this.componentRef.instance.options = this.tableConfig.options;
        }
        if (this.tableConfig.selectionMode !== undefined) {
            this.componentRef.instance.selectionMode = this.tableConfig.selectionMode;
        }
        if (this.tableConfig.sortConfig) {
            this.componentRef.instance.sortConfig = this.tableConfig.sortConfig;
        }
        //PAGINATION
        if (this.tableConfig.hidePaginator) {
            this.componentRef.instance.hidePaginator = this.tableConfig.hidePaginator;
        }
        if (this.tableConfig.pageSize) {
            this.componentRef.instance.pageSize = this.tableConfig.pageSize;
        }
        if (this.tableConfig.pageSizeOptions) {
            this.componentRef.instance.pageSizeOptions = this.tableConfig.pageSizeOptions;
        }
        //VALIDATION
        if (this.tableConfig.lineValidations) {
            this.componentRef.instance.lineValidations = this.tableConfig.lineValidations;
        }
        if (this.tableConfig.lineAsyncValidations) {
            this.componentRef.instance.lineAsyncValidations = this.tableConfig.lineAsyncValidations;
        }
        //FOOTER
        if (this.tableConfig.showFooter) {
            this.componentRef.instance.showFooter = this.tableConfig.showFooter;
        }
        if (this.tableConfig.ngClassRow) {
            this.componentRef.instance.ngClassRow = this.tableConfig.ngClassRow;
        }

        if (this.tableConfig.multiTemplate) {
            this.componentRef.instance.multiTemplate = this.tableConfig.multiTemplate;
            this.componentRef.instance.templates = this.tableConfig.templates || [];
            this.componentRef.instance.templateUnfold = this.tableConfig.templateUnfold;
        }

        this.componentRef.instance.dragDropRows = this.tableConfig.dragDropRows;
        this.componentRef.instance.dragDropRowsOptions = { autoScrollStep: 5, ...this.tableConfig.dragDropRowsOptions };
        this.componentRef.instance.id = this.tableConfig.id;

        // this.componentRef.instance.lines = [...this.lines];

        this.componentRef.instance._onChangeHeaderCell = this._onChangeHeaderCell;
        this.componentRef.instance._onChangeCell = this._onChangeCell;
        this.componentRef.instance._onChangeFooterCell = this._onChangeFooterCell;
        this.componentRef.instance._onSelected = this._onSelected;
        this.componentRef.instance._onLoaded = this._onLoaded;
        this.componentRef.instance._onStatusHeaderChange = this._onStatusHeaderChange;
        this.componentRef.instance._onClick = this._onClick;
    }
}
