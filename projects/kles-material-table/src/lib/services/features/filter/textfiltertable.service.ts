import { KlesTableComponent } from "../../../component/table.component";
import { KlesTableBaseService } from "../tableservice.interface";
export class KlesTextFilterTableService implements KlesTableBaseService {
    table: KlesTableComponent;
    filteredValues = {};
    columnExclude;

    constructor(column: string) {
        this.columnExclude = column;
    }

    filterData() {
        console.log('#FilterData Table=', this.table);
        if (this.table) {
            this.filteredValues = this.table.formHeader.value;
            console.log('filterValue=', this.filteredValues);
            this.table.dataSource.filterPredicate = this.createFilter();
            console.log('JSON filterValues=', JSON.stringify(this.filteredValues));
            this.table.dataSource.filter = JSON.stringify(this.filteredValues);
        }
    }

    /**Filter */
    protected createFilter() {
        const myFilterPredicate = (data: any, filter: string): boolean => {
            const searchString = JSON.parse(filter);
            return Object.keys(searchString).filter(f => f !== this.columnExclude).every(key => {
                console.log('Data key=', data[key]);
                console.log('SearchString key=', searchString[key]);
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