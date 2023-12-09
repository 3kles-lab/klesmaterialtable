import { IKlesFieldConfig } from '@3kles/kles-material-dynamicforms';
import { IKlesCellFieldConfig } from './cell.model';
import { IKlesHeaderFieldConfig } from './header-field.config.model';
import { AlignCell } from '../enums/align.enum';

export interface KlesColumnConfig {
    columnDef: string;
    sticky?: boolean;
    stickyEnd?: boolean;
    visible: boolean;
    disabled?: boolean;
    name?: string;
    ngClass?: any;
    filterable?: boolean;
    sortable?: boolean;
    resizable?: boolean;
    headerCell: IKlesHeaderFieldConfig;
    cell: IKlesCellFieldConfig;
    footerCell?: IKlesCellFieldConfig;
    canUnfold?: boolean;
    align?: AlignCell;
}
export interface KlesTreeColumnConfig extends KlesColumnConfig {
    canExpand?: boolean;
    paginator?: boolean;
    paginatorOption?: {
        pageSize?: number;
        showFirstLastButtons?: boolean;
        hidePageSize?: boolean;
        pageSizeOptions?: number[]
    }

}
