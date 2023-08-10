import { KlesFormTextComponent } from '@3kles/kles-material-dynamicforms';
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
                        { value: { NAME: 'Arthur', AGE: 50 }, children: [] }
                    ]
                }
            ]
        }
    ];

    tableConfigExample1: KlesTableConfig = {
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
