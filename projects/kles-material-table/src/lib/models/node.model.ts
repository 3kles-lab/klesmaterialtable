export interface Node {
    value: any;
    _unfold?: boolean;
    _id: string;
    options?: { [key: string]: string };
    children?: Node[];
    childrenCounter?: number;
    isBusy?: boolean;
}

export interface SearchableNode<T> extends Node {
    children: SearchableNode<T>[];
}

export interface TreeTableNode<T> extends SearchableNode<T> {
    depth: number;
    isVisible: boolean;
    isExpanded: boolean;
    children: TreeTableNode<T>[];
    childrenCounter: number;
    isBusy?: boolean;
    parentId?: string;
}

export interface NodeInTree<T> extends SearchableNode<T> {
    pathToRoot: SearchableNode<T>[];
}
