import { Component } from "@angular/core";
import { AbstractTreeCell } from "./treecell.abstract";
import { CommonModule } from "@angular/common";
import { KlesDynamicCellDirective } from "../../../directives/dynamic-cell.directive";

@Component({
    selector: 'app-kles-leaf',
    template: `
        <div [innerHTML]="formatIndentation(row)"></div>
        <ng-container klesDynamicCell [field]="field" [group]="group" [column]="column" [siblingFields]="siblingFields">
        </ng-container>
    `,
    styles: [
        `:host { display: inline-flex}`
    ],
    standalone: true,
    imports: [
        CommonModule,
        KlesDynamicCellDirective
    ]
})

export class KlesLeafComponent extends AbstractTreeCell {

}
