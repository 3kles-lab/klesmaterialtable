import { Component } from "@angular/core";
import { AbstractCell } from "./cell.abstract";

@Component({
    selector: 'app-kles-leaf',
    template: `
        <div [innerHTML]="formatIndentation(row)"></div>
        <ng-container klesDynamicField [field]="field" [group]="group">
        </ng-container>
    `,
    styles: [
        `:host { display: inline-flex}`
    ]
})

export class KlesLeafComponent extends AbstractCell {

}
