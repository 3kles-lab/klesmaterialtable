import { Component, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from "@angular/core";
import { AbstractTreeCell } from "./treecell.abstract";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { FormGroup, UntypedFormGroup } from "@angular/forms";
import { IKlesCellFieldConfig } from "../../../models/cell.model";

@Component({
    selector: 'app-kles-node',
    encapsulation: ViewEncapsulation.None,
    template: `
        <div style="display: flex; flex-direction: column; flex: auto;">
        <div style="display:flex; align-items: center; gap:3px">
            <div *ngIf="column.canExpand" [innerHTML]="formatIndentation(row)"></div>
        
            <mat-icon *ngIf="!row.getRawValue()?._status?.isBusy && row.value._status.childrenCounter>0"
                class="size-16" (click)="onNodeClick(row)">
                {{row.value._status.isExpanded ? 'remove' : 'add'}}
            </mat-icon>
            <mat-spinner *ngIf="row.getRawValue()?._status?.isBusy && column.canExpand" diameter="25"></mat-spinner>

            <ng-container klesDynamicCell [field]="field"
                [group]="group" [column]="column" [config]="{templateUnfold}">
            </ng-container>
        </div>

        <div class="paginator">
            <mat-paginator #treePaginator *ngIf="column.paginator && row.value._status.childrenCounter>0 && row.value._status.isExpanded"
                [length]="row.value._status.paginator?.length"
                [pageSize]="row.value._status.paginator?.pageSize"
                [showFirstLastButtons]="column.paginatorOption?.showFirstLastButtons"
                [hidePageSize]="column.paginatorOption?.hidePageSize === undefined ? true : column.paginatorOption?.hidePageSize"
                [pageSizeOptions]="column.paginatorOption?.pageSizeOptions || [5, 10, 25, 100]"
                [pageIndex]="row.value._status.paginator?.pageIndex"
                (page)="handlePageEvent($event)">
            </mat-paginator>
        </div>

        </div>
    
    
    `,
    styles: [
        'app-kles-node mat-icon {cursor: pointer}',
        `app-kles-node .size-16 {
                 width: 16px;
                 height: 16px;
                 font-size: 16px;
                 color:#404040;
                 background: white;
                 border: 1px solid #C0C0C0;margin-right:4px;}
                 `,
        `app-kles-node { display: inline-flex; align-items: center; flex-direction: row; width: 100%; }`,
        `app-kles-node .mat-mdc-paginator-range-label { margin: 0px }`,
        `app-kles-node .mat-mdc-paginator { background: transparent }`,
        `app-kles-node .mat-mdc-paginator-range-label { min-width: max-content }`,
        `app-kles-node .mat-mdc-paginator-container { padding: 0 2px 0 8px; min-height: auto }`,
        `app-kles-node .paginator { display: flex; width: 100%; justify-content: end; }`,
    ],
})

export class KlesNodeComponent extends AbstractTreeCell {

    templateUnfold: { cells: IKlesCellFieldConfig[], multiUnfold?: boolean; disabled?: (row: UntypedFormGroup) => boolean; }

    onNodeClick(row: any): void {
        (this.group.controls._status as FormGroup).controls.paginator?.patchValue({
            pageIndex: 0
        }, { emitEvent: false });
        super.onNodeClick(row);
    }

    handlePageEvent(e: PageEvent) {
        this.group.controls._status.patchValue({
            paginator: {
                pageIndex: e.pageIndex,
                pageSize: e.pageSize,
                length: e.length
            }
        });
    }
}