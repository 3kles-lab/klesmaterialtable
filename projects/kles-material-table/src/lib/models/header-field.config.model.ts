import { IKlesFieldConfig } from "@3kles/kles-material-dynamicforms";
import { Type } from "@angular/core";

export interface IKlesHeaderFieldConfig extends IKlesFieldConfig {
    filterComponent?: Type<any>; //filter component for header
    filterClearable?: boolean; //active button to clear filter
    filterable?: boolean;
    filterPredicate?: (value: any, filter: any) => boolean; //override default predicate only for this field
    sortable?: boolean;
}