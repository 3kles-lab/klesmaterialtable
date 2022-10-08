import { Component, ViewEncapsulation } from "@angular/core";
import { AbstractCell } from "./cell.abstract";

@Component({
    selector: 'app-kles-node',
    template: `
    
        <div *ngIf="column.canExpand" [innerHTML]="formatIndentation(row)"></div>
        <mat-icon *ngIf="!row.getRawValue()?._status?.isBusy"
            [ngStyle]="{'visibility': row.value._status.childrenCounter>0 ? 'visible' : 'hidden'}"
            class="size-16" (click)="onNodeClick(row)">
            {{row.value._status.isExpanded ? 'remove' : 'add'}}
        </mat-icon>
        <mat-spinner *ngIf="row.getRawValue()?._status?.isBusy && column.canExpand" diameter="30"></mat-spinner>
    
        <ng-container klesDynamicField [field]="field"
            [group]="group">
        </ng-container>
    
    
    `,
    styles: [
        'mat-icon {cursor: pointer}',
        `.size-16 {
        width: 16px;
        height: 16px;
        font-size: 16px;
        color:#404040;
        background: white;
        border: 1px solid #C0C0C0;margin-right:4px;}
        `,
        `:host { display: inline-flex}`
    ],
})

export class KlesNodeComponent extends AbstractCell {

}