import { UntypedFormGroup } from "@angular/forms";
import * as _ from "lodash";
import { KlesTableComponent } from "../../../component/table/table.component";
import { KlesTableBaseService } from "../tableservice.interface";
export class KlesTextFilterTableService implements KlesTableBaseService {
    table: KlesTableComponent;
    filteredValues = {};

    filterData() {
        if (this.table) {
            this.filteredValues = this.table.formHeader.value;
            this.table.dataSource.filterPredicate = this.createFilter();
            this.table.dataSource.filter = JSON.stringify(this.filteredValues);
        }
    }

    /**Filter */
    protected createFilter() {
        const myFilterPredicate = (data: UntypedFormGroup, filter: string): boolean => {
            let searchString = JSON.parse(filter);
            const filterableColumn = this.table.columns.filter(f => f.filterable).map(m => m.columnDef);

            searchString = _.pick(searchString, filterableColumn);

            return Object.keys(searchString).filter(f => filterableColumn.includes(f)).every(key => {

                let keyValue = data?.controls[key]?.value;

                if (!keyValue && searchString[key].length === 0) {
                    return true;
                } else if (!keyValue) {
                    return false;
                } else if (!searchString[key]) {
                    return true;
                }

                const column = this.table.columns.find(col => col.columnDef === key);

                if (column.cell.property) {
                    keyValue = data?.controls[key]?.value[column.cell.property];
                }
                return keyValue && keyValue.toString().trim().toLowerCase().indexOf(searchString[key].toLowerCase()) !== -1;
            });
        };
        return myFilterPredicate;
    }


}