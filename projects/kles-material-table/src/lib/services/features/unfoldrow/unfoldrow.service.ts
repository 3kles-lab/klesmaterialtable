import { UntypedFormGroup } from "@angular/forms";
import { KlesTableComponent } from "../../../component/table/table.component";
import { KlesTableBaseService } from "../tableservice.interface";

export class KlesUnfoldRowTableService implements KlesTableBaseService {
    table: KlesTableComponent;


    unfoldRow({ group, row, value }: { group: UntypedFormGroup, row: any, value: any }) {
        if (this.table && this.table.templateUnfold) {
            const isUnfold = group.controls._unfold?.value;
            if (!this.table.templateUnfold?.multiUnfold && isUnfold) {
                this.table.getFormArray().controls
                    .filter((row: UntypedFormGroup) => row.controls._id.value !== group.controls._id.value)
                    .forEach((row: UntypedFormGroup) => row.controls._unfold.patchValue(false, { emitEvent: false }));
            }
        }
    }
}