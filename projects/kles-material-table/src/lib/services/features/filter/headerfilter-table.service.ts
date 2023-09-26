import { UntypedFormGroup } from "@angular/forms";
import * as _ from "lodash";
import * as moment from "moment";
import { KlesTableComponent } from "../../../component/table/table.component";
import { KlesColumnConfig } from "../../../models/columnconfig.model";
import { KlesTableBaseService } from "../tableservice.interface";
export class KlesHeaderFilterTableService implements KlesTableBaseService {
    table: KlesTableComponent;
    filteredValues = {};

    filterData() {
        if (this.table) {
            this.filteredValues = this.table.formHeader.value;
            Object.keys(this.filteredValues).map(key => {
                if (moment.isMoment(this.filteredValues[key])) {
                    this.filteredValues[key] = this.filteredValues[key].toDate().toDateString();
                }
            })
            this.table.dataSource.filterPredicate = this.createFilter();
            this.table.dataSource.filter = JSON.stringify(this.filteredValues);
        }
    }

    /**Filter */
    protected createFilter() {
        const myFilterPredicate = (data: UntypedFormGroup, filter: string): boolean => {
            let searchString = JSON.parse(filter);
            const filterableColumn = this.table.columns().filter(f => f.filterable).map(m => m.columnDef);

            searchString = _.pick(searchString, filterableColumn);
            return Object.keys(searchString).filter(f => searchString[f] && filterableColumn.includes(f)).every(key => {
                let keyValue = data?.controls[key]?.value;
                const column: KlesColumnConfig = this.table.columns().find(col => col.columnDef === key);

                if (keyValue && typeof (keyValue) === 'object' && column.cell.property) {
                    keyValue = keyValue[column.cell.property];
                }
                if (searchString[key] && typeof (searchString[key]) === 'object' && (column.headerCell.property || column.cell.property)) {
                    if (Array.isArray(searchString[key])) {
                        if (!searchString[key].length) return true;
                        const list = (searchString[key] as Array<any>).map(m => m[column.headerCell.property || column.cell.property].toLowerCase());
                        return keyValue && list.includes(keyValue.toString().trim().toLowerCase());
                    } else {
                        searchString[key] = searchString[key][column.headerCell.property || column.cell.property];
                    }
                }
                if (!keyValue && searchString[key].length === 0) {
                    return true;
                } else if (!keyValue) {
                    return false;
                } else if (!searchString[key]) {
                    return true;
                }
                return keyValue && keyValue.toString().trim().toLowerCase().indexOf(searchString[key].toLowerCase()) !== -1;
            });
        };
        return myFilterPredicate;
    }

}