import { Pipe } from "@angular/core";
import { RowPipe } from "./row.pipe";
import { UntypedFormGroup } from "@angular/forms";

@Pipe({
    name: 'rowTreePipe',
    pure: false,
    standalone: true
})
export class RowTreePipe extends RowPipe {

    transform(row: UntypedFormGroup): any {
        return {
            'row-odd': row.value._status.depth % 2 !== 0,
            ...super.transform(row)
        }
    }
}