import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Option, some, none } from 'fp-ts/lib/Option';
import { AbstractKlesTableService } from './abstracttable.service';

@Injectable({
    providedIn: 'root'
})
export class KlesTableService extends AbstractKlesTableService {

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