import { UntypedFormGroup } from '@angular/forms';
import { KlesTreeColumnConfig } from '../../../models/columnconfig.model';
import { AbstractCell } from '../../cell/cell.abstract';

export abstract class AbstractTreeCell extends AbstractCell<KlesTreeColumnConfig> {
    row: UntypedFormGroup;

    formatIndentation(node: UntypedFormGroup, step: number = 5): string {
        return '&nbsp;'.repeat(node.value._status.depth * step);
    }

    onNodeClick(row) {
        row.controls._status.patchValue({
            isExpanded: !row.value._status.isExpanded
        });
    }
}
