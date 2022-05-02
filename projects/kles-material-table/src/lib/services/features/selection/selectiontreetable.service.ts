import { FormArray, FormGroup } from "@angular/forms";
import { KlesTreetableComponent } from "../../../component/treetable/treetable.component";
import { KlesSelectionTableService } from "./selectiontable.service";

export class KlesSelectionTreetableService extends KlesSelectionTableService {
    table: KlesTreetableComponent<any>;

    columnSelect: string;

    constructor(column: string) {
        super(column);
    }

    changeSelectionLine(e: any) {
        if (this.table) {
            if (e.column.columnDef === this.columnSelect && e.row) {
                if (this.table.dataSource.filteredData.includes(e.group)) {
                    const selected = (e.group as FormGroup).controls[e.column.columnDef].value;
                    this.updateChildrens(e.column, e.group, selected);
                    this.updateParent(e.column, e.group);

                    this.table.selection.clear();

                    /* TODO not sure about this*/
                    (this.table.form.controls.rows as FormArray).controls
                        .filter((group: FormGroup) => group.controls[this.columnSelect].value === true)
                        .forEach(control => {
                            this.table.selection.select(control);
                        });
                    /* ***************** */
                    this.table._onSelected.emit(this.table.selection.selected);
                }
            }

            if (this.isAllSelected()) {
                this.table.columns.filter(f => f.columnDef === this.columnSelect).map(m => m.headerCell.indeterminate = false);
                this.table.formHeader.controls[this.columnSelect]?.patchValue(true, { onlySelf: true, emitEvent: false });

            } else {
                this.table.columns.filter(f => f.columnDef === this.columnSelect).map(m => m.headerCell.indeterminate = !this.table.selection.isEmpty());
                if (this.table.selection.isEmpty()) {
                    this.table.formHeader.controls[this.columnSelect]?.patchValue(false, { onlySelf: true, emitEvent: false });
                }
            }

            this.table.form.updateValueAndValidity();
        }
    }

    childrenIsAllSelected(column, group: FormGroup): boolean {
        if (!group.value._status.children) {
            return true;
        }

        return group.value._status.children.every(children => {
            return (this.table.dataSource.data.find(row => row.value._id === children._id) as FormGroup).controls[column.columnDef].value === true;
        });
    }


    childrenAtLeastOneSelected(column, group: FormGroup): boolean {
        if (!group.value._status.children) {
            return true;
        }
        return group.value._status.children.some(children => {
            const index = this.table.dataSource.data.findIndex(row => row.value._id === children._id);

            return (this.table.dataSource.data.find(row => row.value._id === children._id) as FormGroup).controls[column.columnDef].value === true
                || this.table.lineFields[index].find(field => field.name === column.columnDef).indeterminate === true;
        });
    }



    isAllSelected(): boolean {
        if (this.table) {
            const numSelected = this.table.selection.selected
                .filter(s => this.table.dataSource.filteredData.includes(s)).length;
            const numRows = this.table.dataSource.filteredData.length;
            return numSelected === numRows;
        }
        return false;
    }



    updateChildrens(column, group: FormGroup, selected: boolean) {
        const childrens = (group.controls._status as FormGroup).controls.children?.value || [];
        childrens.forEach(children => {
            const childGroup = this.table.dataSource.data.find(row => row.value._id === children._id) as FormGroup;
            if (childGroup.controls[column.columnDef].value !== selected) {
                childGroup.controls[column.columnDef].patchValue(selected, { emitEvent: false });
            }
            this.updateChildrens(column, childGroup, selected);
        });
    }

    updateParent(column, group: FormGroup) {
        const node = this.table.searchableTree.map(st => this.table.treeService.searchById(st, group.value._id)).find(st => st.isSome()).getOrElse(null);

        if (node) {
            node.pathToRoot.forEach(parent => {
                const parentGroup = this.table.dataSource.data.find(row => row.value._id === parent._id) as FormGroup;

                const index = this.table.dataSource.data.findIndex(row => row.value._id === parent._id);
                this.table.lineFields[index].find(field => field.name === column.columnDef).indeterminate = false;

                if (this.childrenIsAllSelected(column, parentGroup)) {
                    parentGroup.controls[column.columnDef].patchValue(true, { emitEvent: false });
                } else if (this.childrenAtLeastOneSelected(column, parentGroup)) {
                    this.table.lineFields[index].find(field => field.name === column.columnDef).indeterminate = true;
                    parentGroup.controls[column.columnDef].patchValue(false, { emitEvent: false });
                } else {
                    parentGroup.controls[column.columnDef].patchValue(false, { emitEvent: false });
                }

            })
        }
    }
}