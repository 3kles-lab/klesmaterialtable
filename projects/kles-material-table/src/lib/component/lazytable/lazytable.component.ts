import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, merge, of } from 'rxjs';
import { catchError, startWith, switchMap, tap } from 'rxjs/operators';
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

    constructor(protected translate: TranslateService,
        protected adapter: DateAdapter<any>,
        private fb1: FormBuilder,
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
    }
    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }
    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.sort.sortChange, this.paginator.page, this.filteredValues$)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.loading = true;
                    return this.tableService.load(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize,
                        this.filteredValues$.getValue());
                }),
                tap(() => this.loading = false),
                catchError(() => {
                    this.loading = false;
                    return of({ lines: [], totalCount: 0 });
                })
            )
            .subscribe((response) => {
                this.updateData(response.lines);
                this.paginator.length = response.totalCount;
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
