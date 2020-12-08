import { IFieldConfig } from 'kles-material-dynamicforms';

export interface ColumnConfig {
    columnDef: string;
    sticky?: boolean;
    header: string;
    visible: boolean;
    disabled?: boolean;
    type: string;
    name?: string;
    headerCell: IFieldConfig;
    cell: IFieldConfig;
    footerCell: IFieldConfig;
}

export interface Options<T> {
    verticalSeparator?: boolean;
    capitalisedHeader?: boolean;
    highlightRowOnHover?: boolean;
    customColumnOrder?: Array<keyof T> & string[];
    elevation?: number;
}
