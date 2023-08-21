import { Component } from "@angular/core";
import { AbstractTreeCell } from "./treecell.abstract";

@Component({
    selector: 'app-kles-leaf',
    template: `
        <div [innerHTML]="formatIndentation(row)"></div>
        <ng-container klesDynamicCell [field]="field" [group]="group" [column]="column">
        </ng-container>
    `,
    styles: [
        `:host { display: inline-flex}`
    ]
})

export class KlesLeafComponent extends AbstractTreeCell {

}
