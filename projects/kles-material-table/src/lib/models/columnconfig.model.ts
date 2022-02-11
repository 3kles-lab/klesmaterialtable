import { IKlesFieldConfig } from '@3kles/kles-material-dynamicforms';

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
    headerCell: IKlesFieldConfig;
    cell: IKlesFieldConfig;
    footerCell?: IKlesFieldConfig;
}
