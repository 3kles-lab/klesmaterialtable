import { IKlesComponent } from "@3kles/kles-material-dynamicforms";
import { Component, OnInit, Type } from "@angular/core";
import * as _ from "lodash";

@Component({
    selector: 'kles-auto',
    template: `
    <span>
        {{value.key}} - {{value.label}}
    </span> 
`
})
export class AutocompleteComponent implements IKlesComponent, OnInit {
    component: Type<any>;
    value: any;

    ngOnInit() {
        const temp = _.cloneDeep(this.value);
        if (!temp.key) {
            if (Object.keys(temp).length > 0) {
                this.value.key = temp[Object.keys(temp)[0]];
            }
            if (Object.keys(temp).length > 1) {
                this.value.label = temp[Object.keys(temp)[1]];
            }
        }
    }
}
