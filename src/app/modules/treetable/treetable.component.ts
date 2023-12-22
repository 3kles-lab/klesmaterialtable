import { KlesFormCheckboxComponent, KlesFormTextComponent } from '@3kles/kles-material-dynamicforms';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { KlesFormTextHeaderComponent, IKlesHeaderFieldConfig, IKlesCellFieldConfig, KlesTableConfig, KlesTreetableComponent, KlesTreetableService, KlesTreeColumnConfig } from 'kles-material-table';

@Component({
    selector: 'app-treetable',
    templateUrl: './treetable.component.html',
    styleUrls: ['./treetable.component.scss']
})
export class TreeTableComponent implements OnInit, AfterViewInit, OnDestroy {
    columnsExample1: KlesTreeColumnConfig[] = [
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
            canExpand: true,
            headerCell: {
                name: 'NAME',
                component: KlesFormTextHeaderComponent,
                label: 'Name'
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'NAME',
                component: KlesFormTextComponent
            } as IKlesCellFieldConfig
        },
        {
            columnDef: 'AGE',
            visible: true,
            headerCell: {
                name: 'AGE',
                component: KlesFormTextHeaderComponent,
                label: 'Age'
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'AGE',
                component: KlesFormTextComponent
            } as IKlesCellFieldConfig
        }
    ];

    linesExample1 = [
        {
            value: { NAME: 'Léo', AGE: 30 }, children: [
                {
                    value: { NAME: 'Gabriel', AGE: 40 }, children: [
                        { value: { NAME: 'Arthur', AGE: 50 }, children: [] },
                        { value: { NAME: 'Patrick', AGE: 60 }, children: [] }
                    ]
                },
                {
                    value: { NAME: 'toto', AGE: 10 }, children: [
                        { value: { NAME: 'tata', AGE: 14 } }
                    ]
                }
            ]
        },
        {
            value: { NAME: 'Charles', AGE: 28 }
        }
    ];

    tableConfigExample1: KlesTableConfig = {
        dragDropRows: true,
        columns: this.columnsExample1,
        tableComponent: KlesTreetableComponent,
        tableService: new KlesTreetableService()
    };

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }
}
