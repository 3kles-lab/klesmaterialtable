import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, concat, merge, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, skip, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AbstractKlesLazyTableService } from '../../services/lazy/abstractlazytable.service';
import { KlesTableComponent } from '../table/table.component';
import { rowsAnimation } from '../../animations/row.animation';
import { MatTable, MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CellPipe } from '../../pipe/cell.pipe';
import { ElevationPipe } from '../../pipe/elevation.pipe';
import { FieldPipe } from '../../pipe/field.pipe';
import { RowPipe } from '../../pipe/row.pipe';
import { SpanPipe } from '../../pipe/span.pipe';
import { KlesDynamicCellDirective } from '../../directives/dynamic-cell.directive';
import { KlesComponentDirective, KlesDynamicFieldDirective } from '@3kles/kles-material-dynamicforms';
import { RowDragDisabledPipe } from '../../pipe/rowdragdisabled.pipe';
import { GroupPipe } from '../../pipe/group.pipe';
import { KlesDynamicHeaderDirective } from '../../directives/dynamic-header.directive';
import { KlesResizeColumnDirective } from '../../directives/resizecolumn.directive';

@Component({
    selector: 'app-kles-lazytable',
    templateUrl: './lazytable.component.html',
    styleUrls: ['./lazytable.component.scss', '../../styles/dragdrop.scss', '../../styles/align-cell.scss', '../../styles/input.scss'],
    animations: [rowsAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      MatTableModule,
      MatSortModule,
      MatPaginatorModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      MatTooltipModule,
      MatProgressSpinnerModule,
      DragDropModule,
      ScrollingModule,
      CdkTableModule,
      KlesDynamicCellDirective,
      KlesDynamicHeaderDirective,
      KlesDynamicFieldDirective,
      KlesComponentDirective,
      KlesResizeColumnDirective,
      RowPipe,
      CellPipe,
      FieldPipe,
      SpanPipe,
      ElevationPipe,
      RowDragDisabledPipe,
      GroupPipe
    ]
})
export class KlesLazyTableComponent extends KlesTableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  loading = signal(false);
  filteredValues$ = new BehaviorSubject<{ [key: string]: any; }>({});
  reload$ = new Subject<void>();

  @ViewChild(MatTable) matTable: MatTable<any>;

  @Output() _onSelectedLineResponse = new EventEmitter<any>();
  @Output() _onSelectedResponse = new EventEmitter<any>();

  constructor(
    protected adapter: DateAdapter<any>,
    private fb1: UntypedFormBuilder,
    public ref: ChangeDetectorRef,
    protected dialog: MatDialog,
    public sanitizer: DomSanitizer,
    public _adapter: DateAdapter<any>,
    @Inject('tableService') public tableService: AbstractKlesLazyTableService,
    protected _elementRef: ElementRef
  ) {
    super(adapter, fb1, ref, dialog, sanitizer, _adapter, tableService, _elementRef);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.filteredValues$.next(
      this.columns()
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

    const events$ = merge(
      this.reload$,
      this.sort.sortChange,
      this.filteredValues$.pipe(skip(1), debounceTime(500), startWith(this.filteredValues$.getValue()))
    ).pipe(
      tap(() => this.paginator.pageIndex = 0)
    );

    merge(events$, this.paginator.page.pipe(distinctUntilChanged()))
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
          this.loading.set(true);
        } else {
          this.loading.set(false);

          if (this.showFooter && response.value.footer) {
            this.formFooter.patchValue(response.value.footer);
          }
          if (response.value.header) {
            this.formHeader.patchValue(response.value.header, { emitEvent: false });
          }
          this.updateData(response.value.lines);
          this.paginator.length = response.value.totalCount;
        }
        this.matTable?.updateStickyColumnStyles();
      });

  }
  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  // getLineFields(index, key) {
  //     return this.lineFields[index].find(f => f.name === key);
  // }

  getLineFields(_id, key) {
    // return this.lineFields[index].find(f => f.name === key);
    const listField = this.listFields.find((f) => f._id === _id);
    if (listField) {
      return listField.fields.find((f) => f.name === key);
    }
  }

  setDataSourceAttributes() {
    if (this.sort) {
      if (this.paginator && !this.hidePaginator) {
        this.sort.sortChange.subscribe(() => {
          this.paginator.pageIndex = 0;
        });
      }
      if (this.sortConfig) {
        this.sort.active = this.sortConfig.active;
        this.sort.direction = this.sortConfig.direction;
        this.sort.sortChange.emit(this.sortConfig);
        // this.sortDefault = !this.sortDefault;
      }
    }
    this.tableService.setTable(this);

  }
}
