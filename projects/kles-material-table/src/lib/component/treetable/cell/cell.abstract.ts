import { KlesFieldAbstract } from "@3kles/kles-material-dynamicforms";
import { FormGroup } from "@angular/forms";
import { KlesTreeColumnConfig } from "../../../models/columnconfig.model";

export abstract class AbstractCell {
    column: KlesTreeColumnConfig;
    row: FormGroup;
    field: KlesFieldAbstract;
    group: FormGroup;

    formatIndentation(node: FormGroup, step: number = 5): string {
        return '&nbsp;'.repeat(node.value._status.depth * step);
    }

    onNodeClick(row) {
        row.controls._status.patchValue({
            isExpanded: !row.value._status.isExpanded
        });
    }
}