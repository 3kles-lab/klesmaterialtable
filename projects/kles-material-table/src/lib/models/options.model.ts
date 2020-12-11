export interface Options<T> {
    verticalSeparator?: boolean;
    capitalisedHeader?: boolean;
    highlightRowOnHover?: boolean;
    customColumnOrder?: Array<keyof T> & string[];
    elevation?: number;
}
