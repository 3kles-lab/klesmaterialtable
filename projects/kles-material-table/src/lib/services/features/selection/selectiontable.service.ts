import { KlesTableComponent } from "../../../component/table.component";
import { KlesTableBaseService } from "../tableservice.interface";

export class KlesSelectionTableService implements KlesTableBaseService{
    table: KlesTableComponent;

    isAllSelected() {
        const numSelected = this.table.selection.selected
            .filter(s => this.table.dataSource.filteredData.includes(s)).length;
        const numRows = this.table.dataSource.filteredData.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.table.dataSource.filteredData.forEach(row => {
                this.table.selection.deselect(row);
                // this._onSelected.emit(row);
            })
            // this.selection.clear()
            :
            this.table.dataSource.filteredData.forEach(row => {
                this.table.selection.select(row);
                // this._onSelected.emit(row);
            });
        this.table._onSelected.emit(this.table.selection.selected);
    }

    changeSelectLine(row) {
        console.log('changeSelectLine for row=', row);
        if (row) {
            this.table.selection.toggle(row);
            this.table._onSelected.emit(this.table.selection.selected);
        }
    }

}