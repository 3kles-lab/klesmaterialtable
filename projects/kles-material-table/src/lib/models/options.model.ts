export interface Options<T> {
    verticalSeparator?: boolean;
    capitalisedHeader?: boolean;
    uppercasedHeader?: boolean;
    highlightRowOnHover?: boolean;
    customColumnOrder?: Array<keyof T> & string[];
    elevation?: number;
    fullsize?: boolean;
}
