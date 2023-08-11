import { EnumType, KlesFormButtonComponent, KlesFormCheckboxComponent, KlesFormDateComponent, KlesFormInputClearableComponent, KlesFormInputComponent, KlesFormSelectSearchComponent, KlesFormTextComponent } from '@3kles/kles-material-dynamicforms';
import { AfterViewInit, Component, OnDestroy, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { IChangeCell, IKlesCellFieldConfig, IKlesHeaderFieldConfig, KlesColumnConfig, KlesFormDynamicHeaderFilterComponent, KlesFormTextHeaderComponent, KlesTableComponent, KlesTableConfig, KlesTableDirective, KlesTableService } from 'kles-material-table';
import { Subject, of } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { StyleService } from './style.service';
import { FakeApiService } from 'src/app/services/fakemi.service';
import { SelectTableService } from './select.service';
import { CustomPaginator } from './custom-paginator.component';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TableComponent implements AfterViewInit, OnDestroy {
    @ViewChildren(KlesTableDirective) listDirective: QueryList<KlesTableDirective>;

    columnsExample1: KlesColumnConfig[] = [
        {
            columnDef: '#select',
            visible: true,
            headerCell: {
                name: '#select',
                component: KlesFormCheckboxComponent
            } as IKlesHeaderFieldConfig,
            cell: {
                name: '#select',
                component: KlesFormCheckboxComponent
            } as IKlesCellFieldConfig
        },
        {
            columnDef: 'NAME',
            visible: true,
            headerCell: {
                name: 'NAME',
                label: 'Name',
                component: KlesFormTextHeaderComponent
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'NAME',
                component: KlesFormTextComponent
            } as IKlesCellFieldConfig,
            footerCell: {
                name: 'NAME',
                component: KlesFormTextComponent
            } as IKlesCellFieldConfig
        },
        {
            columnDef: 'AGE',
            visible: true,
            headerCell: {
                name: 'AGE',
                label: 'Age',
                component: KlesFormTextHeaderComponent
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'AGE',
                component: KlesFormTextComponent
            } as IKlesCellFieldConfig,
            footerCell: {
                name: 'AGE',
                component: KlesFormTextComponent
            } as IKlesCellFieldConfig
        }
    ];

    footerExample1 = { NAME: 0, AGE: 0 };
    linesExample1 = [{ NAME: 'Léo', AGE: 30, test: 'premier ' }, { NAME: 'Gabriel', AGE: 40, test: 'deuxieme' }, { NAME: 'Arthur', AGE: 50 }];

    tableConfigExample1: KlesTableConfig = {
        columns: this.columnsExample1,
        dragDropRows: true,
        tableComponent: KlesTableComponent,
        tableService: new StyleService(),
        showFooter: true,
        multiTemplate: true,
        templates: [
            { cells: [ { name: 'test', component: KlesFormTextComponent, colspan: 3}], when: (index, rowData) => {
                return rowData.value.test;
            } }
        ]
    };

    columnsExample2: KlesColumnConfig[] = [
        {
            columnDef: '#select',
            visible: false,
            headerCell: {
                name: '#select',
                component: KlesFormTextHeaderComponent
            } as IKlesHeaderFieldConfig,
            cell: {
                name: '#select',
                component: KlesFormCheckboxComponent
            } as IKlesCellFieldConfig
        },
        {
            columnDef: 'WHLO',
            visible: true,
            filterable: true,
            headerCell: {
                name: 'WHLO',
                label: 'Warehouse',
                component: KlesFormDynamicHeaderFilterComponent,
                filterComponent: KlesFormInputClearableComponent
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'WHLO',
                component: KlesFormTextComponent
            } as IKlesCellFieldConfig
        },
        {
            columnDef: 'STYLE',
            visible: true,
            filterable: true,
            headerCell: {
                name: 'STYLE',
                label: 'Style',
                component: KlesFormDynamicHeaderFilterComponent,
                filterComponent: KlesFormInputClearableComponent
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'STYLE',
                component: KlesFormInputComponent
            } as IKlesCellFieldConfig
        },
        {
            columnDef: 'QTY',
            visible: true,
            headerCell: {
                name: 'QTY',
                label: 'Quantity',
                component: KlesFormTextHeaderComponent
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'QTY',
                type: EnumType.group,
                collections: [
                    {
                        name: 'quantity',
                        placeholder: 'Quantity',
                        color: 'primary',
                        inputType: 'number',
                        validations: [
                            {
                                name: 'required',
                                validator: Validators.required,
                                message: 'Required'
                            },
                            {
                                name: 'min',
                                validator: Validators.min(0),
                                message: 'Min 0'
                            }
                        ],
                        component: KlesFormInputComponent
                    },
                    {
                        name: 'validate',
                        label: 'Validate',
                        color: 'primary',
                        ngClass: 'mat-raised-button',
                        buttonType: 'submit',
                        component: KlesFormButtonComponent
                    }
                ],
                valueChanges: (field, group, siblingField, valueChanged) => {
                    if (valueChanged && valueChanged.validate) {
                        console.log(valueChanged.quantity);
                    }

                    group.controls.QTY.patchValue({ validate: null }, { emitEvent: false });
                }
            } as IKlesCellFieldConfig
        },
        {
            columnDef: 'DATE',
            visible: true,
            filterable: true,
            headerCell: {
                name: 'DATE',
                label: 'Date',
                type: EnumType.date,
                component: KlesFormDynamicHeaderFilterComponent,
                filterComponent: KlesFormDateComponent,
                filterClearable: true
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'DATE',
                component: KlesFormDateComponent
            } as IKlesCellFieldConfig
        },
        {
            columnDef: 'COLOR',
            visible: true,
            filterable: true,
            headerCell: {
                name: 'COLOR',
                label: 'Color',
                component: KlesFormDynamicHeaderFilterComponent,
                filterComponent: KlesFormInputComponent
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'COLOR',
                lazy: true,
                options: this.miService.listStyleItem({ program: 'MMS162MI', transaction: 'LstStyleItem', record: { STYN: 'AMB02', OPTY: 'YY03', OPTX: 'X004' } }).pipe(
                    map(response => response.items.map(item => item.TY15))
                ),
                executeAfterChange(property, row, group) {
                    return of(row);
                },
                component: KlesFormSelectSearchComponent
            } as IKlesCellFieldConfig
        },
        {
            columnDef: 'reset',
            visible: true,
            headerCell: {
                name: 'reset',
                component: KlesFormTextHeaderComponent
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'reset',
                label: 'Reset',
                ngClass: 'mat-raised-button',
                component: KlesFormButtonComponent
            } as IKlesCellFieldConfig
        }
    ];

    linesExample2 = [
        { WHLO: 'P60', STYLE: 'AMB01', QTY: { quantity: '5' } },
        { WHLO: 'P60', STYLE: 'AMB02', QTY: { quantity: '5' } },
        { WHLO: 'P60', STYLE: 'AMB03', QTY: { quantity: '5' } },
        { WHLO: 'P60', STYLE: 'AMB04', QTY: { quantity: '5' } },
        { WHLO: 'P60', STYLE: 'AMB05', QTY: { quantity: '5' } },
        { WHLO: 'P60', STYLE: 'AMB06', QTY: { quantity: '5' } }
    ];

    tableConfigExample2: KlesTableConfig = {
        columns: this.columnsExample2,
        tableComponent: KlesTableComponent,
        tableService: new SelectTableService(),
        ngClassRow: (row: UntypedFormGroup) => {
            if (row.controls['#select'].value) {
                return 'selected';
            }
            else if (row.status === 'VALID') {
                return 'row-valid';
            }
            else {
                return 'row-invalid';
            }
        },
        customMatPaginatorIntl: CustomPaginator
    };

    private _onDestroy = new Subject<void>();

    constructor(private miService: FakeApiService) {
    }

    ngAfterViewInit(): void {
        console.log(this.listDirective);
        if (this.listDirective.get(0)) {
            const table = this.listDirective.get(0).componentRef.instance;

            table._onSelected.pipe(
                takeUntil(this._onDestroy)
            ).subscribe(selection => {
                table.formFooter.patchValue({ NAME: selection.map((group: FormGroup) => group.value.NAME.length).reduce((acc, value) => acc + value, 0), AGE: selection.map((group: FormGroup) => group.value.AGE).reduce((acc, value) => acc + value, 0) });
            });
        }

        if (this.listDirective.get(1)) {
            const table = this.listDirective.get(1).componentRef.instance;

            table._onSelected.pipe(
                takeUntil(this._onDestroy)
            ).subscribe(selection => {
                console.log(selection);
            });

            table._onChangeCell.pipe(
                takeUntil(this._onDestroy),
                filter((event: IChangeCell) => event.column.columnDef === 'reset')
            ).subscribe((event: IChangeCell) => {
                table.getFormArray().controls.filter((group: FormGroup) => {
                    return group.value._id === event.row._id;
                }).forEach((group: FormGroup) => {
                    group.patchValue({ STYLE: '', QTY: { quantity: '' }, DATE: '', COLOR: '' }, { emitEvent: false });
                });
            });
        }
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
}
