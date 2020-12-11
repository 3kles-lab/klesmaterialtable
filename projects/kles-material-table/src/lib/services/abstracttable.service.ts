import { Injectable } from '@angular/core';
import { KlesTableComponent } from '../component/table.component';

@Injectable({
    providedIn: 'root'
})
export class AbstractKlesTableService {

    protected table: KlesTableComponent;

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
    protected createFilter() {
        const myFilterPredicate = (data: any, filter: string): boolean => {
            return true;
        };
        return myFilterPredicate;
    }


    changeSelection() {

    }


    /**Setters */

    public setTable(table: KlesTableComponent) {
        this.table = table;
    }

}