import { KlesFieldAbstract } from '@3kles/kles-material-dynamicforms';
import { UntypedFormGroup } from '@angular/forms';
import { KlesTreeColumnConfig } from '../../../models/columnconfig.model';

export abstract class AbstractCell {
    column: KlesTreeColumnConfig;
    row: UntypedFormGroup;
    field: KlesFieldAbstract;
    group: UntypedFormGroup;

    formatIndentation(node: UntypedFormGroup, step: number = 5): string {
        return '&nbsp;'.repeat(node.value._status.depth * step);
    }

    onNodeClick(row) {
        row.controls._status.patchValue({
            isExpanded: !row.value._status.isExpanded
        });
    }
}
