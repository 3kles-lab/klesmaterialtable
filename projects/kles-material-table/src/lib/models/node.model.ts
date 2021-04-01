export interface Node {
    value: any;
    _id: string;
    options?: { [key: string]: string }
    children?: Node[];
}

export interface SearchableNode extends Node {
    id: string;
    children?: SearchableNode[];
}

export interface TreeTableNode extends SearchableNode {
    depth: number;
    isVisible: boolean;
    isExpanded: boolean;
    children?: TreeTableNode[];
}

export interface NodeInTree extends SearchableNode {
    pathToRoot: SearchableNode[];
}
