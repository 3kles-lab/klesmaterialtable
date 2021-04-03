import { KlesTableComponent } from "../../../component/table.component";
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
        const myFilterPredicate = (data: any, filter: string): boolean => {
            const searchString = JSON.parse(filter);
            const filterableColumn = this.table.columns.filter(f => f.filterable).map(m => m.columnDef);
            return Object.keys(searchString).filter(f => filterableColumn.includes(f)).every(key => {
                if (!data[key] && searchString[key].length === 0) {
                    return true;
                } else if (!data[key]) {
                    return false;
                } else if (!searchString[key]) {
                    return true;
                }
                return data[key].toString().trim().toLowerCase().indexOf(searchString[key].toLowerCase()) !== -1;
            });
        };
        return myFilterPredicate;
    }


}