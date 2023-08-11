import { KlesFormTextComponent } from '@3kles/kles-material-dynamicforms';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { KlesTreeColumnConfig, KlesFormTextHeaderComponent, IKlesHeaderFieldConfig, IKlesCellFieldConfig, KlesTableConfig, KlesLazyTreetableComponent, KlesLazyTreetableService, IPagination, ILoadChildren } from 'kles-material-table';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
    selector: 'app-lazytreetable',
    templateUrl: './lazytreetable.component.html',
    styleUrls: ['./lazytreetable.component.scss']
})
export class LazyTreeTableComponent implements OnInit, AfterViewInit, OnDestroy {
    columnsExample1: KlesTreeColumnConfig[] = [
        {
            columnDef: 'NAME',
            visible: true,
            canExpand: true,
            paginator: true,
            paginatorOption: {
                pageSize: 5
            },
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
        },
        {
            columnDef: 'children',
            visible: false,
            headerCell: {
                name: 'children',
                component: KlesFormTextComponent
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'children',
                component: KlesFormTextComponent
            } as IKlesCellFieldConfig
        }
    ];

    linesExample1$: Observable<any[]>;
    tableConfigExample1: KlesTableConfig;

    columnsExample2: KlesTreeColumnConfig[] = [
        {
            columnDef: 'NAME',
            visible: true,
            canExpand: true,
            paginator: true,
            paginatorOption: {
                pageSize: 5
            },
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
        },
        {
            columnDef: 'children',
            visible: false,
            headerCell: {
                name: 'children',
                component: KlesFormTextComponent
            } as IKlesHeaderFieldConfig,
            cell: {
                name: 'children',
                component: KlesFormTextComponent
            } as IKlesCellFieldConfig
        }
    ];

    linesExample2$: Observable<any[]>;
    tableConfigExample2: KlesTableConfig;

    constructor() {
    }

    ngOnInit(): void {
        this.linesExample1$ = of([
            {
                value: {
                    NAME: 'Léo',
                    AGE: 30,
                    children: [
                        {
                            value: {
                                NAME: 'Gabriel',
                                AGE: 40,
                                children: []
                            },
                            childrenCounter: 0
                        },
                        {
                            value: {
                                NAME: 'Arthur',
                                AGE: 50,
                                children: []
                            },
                            childrenCounter: 0
                        },
                        {
                            value: {
                                NAME: 'Gabriel',
                                AGE: 40,
                                children: []
                            },
                            childrenCounter: 0
                        },
                        {
                            value: {
                                NAME: 'Arthur',
                                AGE: 50,
                                children: []
                            },
                            childrenCounter: 0
                        },
                        {
                            value: {
                                NAME: 'Gabriel',
                                AGE: 40,
                                children: []
                            },
                            childrenCounter: 0
                        },
                        {
                            value: {
                                NAME: 'Arthur',
                                AGE: 50,
                                children: []
                            },
                            childrenCounter: 0
                        }
                    ]
                },
                childrenCounter: 1
            }
        ]);

        this.linesExample2$ = of([
            {
                value: {
                    NAME: 'Léo',
                    AGE: 30,
                    children: [
                        {
                            value: {
                                NAME: 'Gabriel',
                                AGE: 40,
                                children: [
                                    {
                                        value: {
                                            NAME: 'Arthur',
                                            AGE: 50,
                                            children: []
                                        },
                                        childrenCounter: 0
                                    }
                                ]
                            },
                            childrenCounter: 1
                        }
                    ]
                },
                childrenCounter: 1
            }
        ]);

        const list = this;

        this.tableConfigExample1 = {
            columns: this.columnsExample1,
            tableComponent: KlesLazyTreetableComponent,
            dragDropRows: true,
            tableService: new KlesLazyTreetableService(new class implements IPagination {
                public list(sort: string, order: string, page: number, perPage: number): Observable<any> {
                    return list.linesExample1$.pipe(
                        map((lines) => {
                            return {
                                lines: order && order.length > 0 ? [...lines].sort((a, b) => {
                                    if (Array.isArray(a[sort])) {
                                        return a[sort].join('').localeCompare(b[sort].join('')) * ((order === 'desc') ? -1 : 1);
                                    } else {
                                        return a[sort].localeCompare(b[sort]) * ((order === 'desc') ? -1 : 1);
                                    }

                                }).slice(perPage * page, perPage * page + perPage)
                                    : lines.slice(perPage * page, perPage * page + perPage),
                                totalCount: lines.length
                            };
                        })
                    );
                }
            }(), new class implements ILoadChildren {
                loadChildren(parent: UntypedFormGroup, sort: string, order: string, page: number, perPage: number): Observable<any> {
                    let children = parent.getRawValue().children || [];

                    children = children.map((value) => {
                        return { value }
                    });

                    return of({ lines: (parent.getRawValue().children || []).slice(page * perPage, page * perPage + perPage), totalCount: parent.getRawValue().children.length }).pipe(delay(1000));
                }
            }())
        };

        this.tableConfigExample2 = {
            columns: this.columnsExample2,
            tableComponent: KlesLazyTreetableComponent,
            tableService: new KlesLazyTreetableService(new class implements IPagination {
                public list(sort: string, order: string, page: number, perPage: number): Observable<any> {
                    return list.linesExample2$.pipe(
                        map((lines) => {
                            return {
                                lines: order && order.length > 0 ? [...lines].sort((a, b) => {
                                    if (Array.isArray(a[sort])) {
                                        return a[sort].join('').localeCompare(b[sort].join('')) * ((order === 'desc') ? -1 : 1);
                                    } else {
                                        return a[sort].localeCompare(b[sort]) * ((order === 'desc') ? -1 : 1);
                                    }

                                }).slice(perPage * page, perPage * page + perPage)
                                    : lines.slice(perPage * page, perPage * page + perPage),
                                totalCount: lines.length
                            };
                        })
                    );
                }
            }(), new class implements ILoadChildren {
                loadChildren(parent: UntypedFormGroup, sort: string, order: string, page: number, perPage: number): Observable<any> {
                    let children = parent.getRawValue().children || [];

                    children = children.map((value) => {
                        return { value }
                    });

                    return of({ lines: (parent.getRawValue().children || []).slice(page * perPage, page * perPage + perPage), totalCount: parent.getRawValue().children.length }).pipe(delay(1000));
                }
            }())
        };
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }
}
