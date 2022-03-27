import { IKlesFieldConfig } from "@3kles/kles-material-dynamicforms";
import { Type } from "@angular/core";

export interface IKlesHeaderFieldConfig extends IKlesFieldConfig {
    filterComponent?: Type<any>; //filter component for header
    filterClearable?: boolean; //active button to clear filter
    filterable?: boolean;
    sortable?: boolean;
}