import { KlesFormInputClearableComponent, KlesFormTextComponent } from '@3kles/kles-material-dynamicforms';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { IKlesCellFieldConfig, IKlesHeaderFieldConfig, IPagination, KlesColumnConfig, KlesFormDynamicHeaderFilterComponent, KlesFormTextHeaderComponent, KlesLazyTableComponent, KlesLazyTableService, KlesTableConfig } from 'kles-material-table';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
    selector: 'app-lazytable',
    templateUrl: './lazytable.component.html',
    styleUrls: ['./lazytable.component.scss']
})
export class LazyTableComponent implements OnInit, AfterViewInit, OnDestroy {
    columnsExample1: KlesColumnConfig[] = [
        {
            columnDef: '_id',
            visible: true,
            headerCell: {
                name: '_id',
                component: KlesFormDynamicHeaderFilterComponent,
            } as IKlesHeaderFieldConfig,
            cell: {
                name: '_id',
                component: KlesFormTextComponent
            } as IKlesCellFieldConfig
        },
        {
            columnDef: 'NUMBER',
            visible: true,
            filterable: true,
            sortable: true,
            headerCell: {
                name: 'NUMBER',
                label: 'Number',
                component: KlesFormDynamicHeaderFilterComponent,
                filterComponent: KlesFormInputClearableComponent
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'NUMBER',
                component: KlesFormTextComponent
            } as IKlesCellFieldConfig
        }
    ];

    tableConfigExample1: KlesTableConfig = {
        id: 'table1',
        dragDropRowsOptions: {
            connectedTo: ['table2']
        },
        columns: this.columnsExample1,
        tableComponent: KlesLazyTableComponent,
        dragDropRows: true,
        tableService: new KlesLazyTableService(new class implements IPagination {
            public list(sort: string, order: string, page: number, perPage: number, filter: any): Observable<any> {
                return of(Array.from(Array(500).keys()).map((i) => ({ NUMBER: `${i}` }))).pipe(
                    delay(500),
                    map((list) => {
                        const lines = list.filter(line => line.NUMBER.includes(filter.NUMBER ? filter.NUMBER : ''));

                        return {
                            lines: order && order.length > 0 ? lines.sort((a, b) => {
                                if (order === 'asc') {
                                    return (+a.NUMBER) - (+b.NUMBER);
                                }
                                else {
                                    return (+b.NUMBER) - (+a.NUMBER);
                                }

                            }).slice(perPage * page, perPage * page + perPage)
                                : lines.slice(perPage * page, perPage * page + perPage),
                            totalCount: lines.length
                        };
                    })
                );
            }
        }())
    };

    tableConfigExample2: KlesTableConfig = {
        id: 'table2',
        dragDropRowsOptions: {
            connectedTo: ['table1']
        },
        columns: this.columnsExample1,
        tableComponent: KlesLazyTableComponent,
        dragDropRows: true,
        tableService: new KlesLazyTableService(new class implements IPagination {
            public list(sort: string, order: string, page: number, perPage: number, filter: any): Observable<any> {
                return of(Array.from(Array(500).keys()).map((i) => ({ NUMBER: `${i}` }))).pipe(
                    delay(500),
                    map((list) => {
                        const lines = list.filter(line => line.NUMBER.includes(filter.NUMBER ? filter.NUMBER : ''));

                        return {
                            lines: order && order.length > 0 ? lines.sort((a, b) => {
                                if (order === 'asc') {
                                    return (+a.NUMBER) - (+b.NUMBER);
                                }
                                else {
                                    return (+b.NUMBER) - (+a.NUMBER);
                                }

                            }).slice(perPage * page, perPage * page + perPage)
                                : lines.slice(perPage * page, perPage * page + perPage),
                            totalCount: lines.length
                        };
                    })
                );
            }
        }())
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
