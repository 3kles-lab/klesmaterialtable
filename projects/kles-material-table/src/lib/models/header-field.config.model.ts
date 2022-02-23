import { IKlesFieldConfig } from "@3kles/kles-material-dynamicforms";
import { Type } from "@angular/core";

export interface IKlesHeaderFieldConfig extends IKlesFieldConfig {
    filterComponent?: Type<any>; //filter component for header
    filterable?: boolean;
    sortable?: boolean;
}