export interface Node {
    value: any;
    _id: string;
    options?: { [key: string]: string }
    children?: Node[];
}
