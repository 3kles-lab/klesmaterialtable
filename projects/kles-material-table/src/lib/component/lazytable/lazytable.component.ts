import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, concat, merge, of, Subject } from 'rxjs';
import { catchError, debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { AbstractKlesLazyTableService } from '../../services/lazy/abstractlazytable.service';
import { KlesTableComponent } from '../table/table.component';

@Component({
    selector: 'app-kles-lazytable',
    templateUrl: './lazytable.component.html',
    styleUrls: ['./lazytable.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class KlesLazyTableComponent extends KlesTableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    loading: boolean;
    filteredValues$ = new BehaviorSubject<{ [key: string]: any; }>({});
    reload$ = new Subject<void>();

    constructor(protected translate: TranslateService,
        protected adapter: DateAdapter<any>,
        private fb1: UntypedFormBuilder,
        public ref: ChangeDetectorRef,
        protected dialog: MatDialog,
        public sanitizer: DomSanitizer,
        public _adapter: DateAdapter<any>,
        @Inject('tableService') public tableService: AbstractKlesLazyTableService
    ) {
        super(translate, adapter, fb1, ref, dialog, sanitizer, _adapter, tableService);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.filteredValues$.next(
            this.columns
                .filter(column => column.filterable)
                .map(column => {
                    return { [column.columnDef]: this.formHeader.controls[column.columnDef].value };
                })
                .reduce((a, b) => ({ ...a, ...b }), {}));
    }
    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }
    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        merge(this.sort.sortChange, this.filteredValues$.pipe(debounceTime(500)), this.reload$)
            .subscribe(() => this.paginator.pageIndex = 0);

        merge(this.reload$, this.sort.sortChange, this.paginator.page, this.filteredValues$.pipe(debounceTime(500)))
            .pipe(
                takeUntil(this._onDestroy),
                switchMap(() => {
                    return concat(
                        of({ loading: true, value: { lines: [], totalCount: 0, footer: {}, header: {} } }),
                        this.tableService.load(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize,
                            this.filteredValues$.getValue()).pipe(
                                map(value => ({ loading: false, value })),
                                catchError((err) => {
                                    console.error(err);
                                    return of({ loading: false, value: { lines: [], totalCount: 0, footer: {}, header: {} } });
                                })
                            )
                    );
                })
            )
            .subscribe((response) => {
                if (response.loading) {
                    this.loading = true;
                } else {
                    this.loading = false;

                    if (this.showFooter && response.value.footer) {
                        this.formFooter.patchValue(response.value.footer);
                    }
                    if (response.value.header) {
                        this.formHeader.patchValue(response.value.header, { emitEvent: false });
                    }
                    this.updateData(response.value.lines);
                    this.paginator.length = response.value.totalCount;

                }
                this.ref.markForCheck();
            });

    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    getLineFields(index, key) {
        return this.lineFields[index].find(f => f.name === key);
    }

    setDataSourceAttributes() {
        if (this.sort) {
            if (this.paginator && !this.hidePaginator) {
                this.sort.sortChange.subscribe(() => {
                    this.paginator.pageIndex = 0;
                });
            }
            if (
                // !this.sortDefault && 
                this.sortConfig) {
                this.sort.active = this.sortConfig.active;
                this.sort.direction = this.sortConfig.direction;
                this.sort.sortChange.emit(this.sortConfig);
                // this.sortDefault = !this.sortDefault;
            }
        }
        this.tableService.setTable(this);

    }
}
