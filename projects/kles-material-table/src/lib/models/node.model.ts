export interface Node {
    value: any;
    _id: string;
    options?: { [key: string]: string }
    children?: Node[];
}

export interface SearchableNode<T> extends Node {
    children: SearchableNode<T>[];
}

export interface TreeTableNode<T> extends SearchableNode<T> {
    depth: number;
    isVisible: boolean;
    isExpanded: boolean;
    children: TreeTableNode<T>[];
}

export interface NodeInTree<T> extends SearchableNode<T> {
    pathToRoot: SearchableNode<T>[];
}
