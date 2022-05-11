import { IKlesFieldConfig } from '@3kles/kles-material-dynamicforms';
import { IKlesCellFieldConfig } from './cell.model';
import { IKlesHeaderFieldConfig } from './header-field.config.model';

export interface KlesColumnConfig {
    columnDef: string;
    sticky?: boolean;
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
}
export interface KlesTreeColumnConfig extends KlesColumnConfig {
    canExpand?: boolean;
}
