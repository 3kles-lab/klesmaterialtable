import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { KlesTreetableComponent } from "./treetable.component";

export class MatTreetableData<T> extends MatTableDataSource<T> {

  _compareFn = new Intl.Collator('pl', { sensitivity: 'base', numeric: true }).compare;

  private sortChildrends(parent, sort, data) {
    return data.filter(line => parent === this.parentDataAccessor(line, sort.active))
      .sort((a, b) => {
        const valueA = this.sortingDataAccessor(a, sort.active);
        const valueB = this.sortingDataAccessor(b, sort.active);
        const comparatorResult = this._compareFn(<string>valueA, <string>valueB);
        return comparatorResult * (sort.direction == 'asc' ? 1 : -1);
      })
      .flatMap(children => {
        return [children].concat(this.sortChildrends(children, sort, data));
      })
  }


  sortData: ((data: T[], sort: MatSort) => T[]) = (data: T[], sort: MatSort): T[] => {
    const active = sort.active;
    const direction = sort.direction;
    if (!active || direction == '') { return data; }

    return (this.sortChildrends(null, sort, data)); /** parent = null because first element has no parent */

  }

  deptDataAccessor: ((data: T, sortHeaderId: string) => number) = (data: T, sortHeaderId: string): number => {
    return 0;
  }

  parentDataAccessor: ((data: T, sortHeaderId: string) => T);

  table: KlesTreetableComponent<any>;
}