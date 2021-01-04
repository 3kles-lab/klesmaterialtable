import { Injectable } from '@angular/core';
import { AbstractKlesTableService } from './abstracttable.service';

@Injectable({
    providedIn: 'root'
})
export class KlesTableService extends AbstractKlesTableService {
    
    onHeaderChange() {
    }
    onCellChange() {
    }
    onLineChange() {
    }
    onFooterChange() {
    }

    filteredValues = {};
    filterData() {
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
            return Object.keys(searchString).every(key => {
                if (!data[key] && searchString[key].length === 0) {
                    return true;
                } else if (!data[key]) {
                    return false;
                }
                return data[key].toString().trim().toLowerCase().indexOf(searchString[key].toLowerCase()) !== -1;
            });
        };
        return myFilterPredicate;
    }

}