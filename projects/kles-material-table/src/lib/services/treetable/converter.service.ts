import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { TreeService } from './tree.service';
import { v4 as uuidv4 } from 'uuid';
import * as O from 'fp-ts/lib/Option';
import { SearchableNode, TreeTableNode, Node } from '../../models/node.model';

@Injectable({
    providedIn: 'root'
})
export class ConverterService {

    constructor(private treeService: TreeService) { }

    /**
     * Clone a Node<T> object and convert it to a SearchableNode<T>
     * @param tree the node to be converted
     */
    toSearchableTree<T>(tree: Node): SearchableNode<T> {
        const treeClone = cloneDeep<any>(tree) as SearchableNode<T>;
        this.treeService.traverse(treeClone, (node: SearchableNode<T>) => {
            node._id = node._id ? node._id : uuidv4();
        });
        return treeClone;
    }

    /**
     * Clone a SearchableNode<T> object and convert it to a TreeTableNode<T>
     * @param tree the node to be converted
     */
    toTreeTableTree<T>(tree: SearchableNode<T>): TreeTableNode<T> {
        const treeClone = cloneDeep(tree) as TreeTableNode<T>;
        this.treeService.traverse(treeClone, (node: TreeTableNode<T>) => {
            const root = this.treeService.searchById(treeClone, node._id);

            if (O.isSome(root) && root.value.pathToRoot.length > 0) {
                node.parentId = root.value.pathToRoot[0]._id;
            }

            node.depth = this.treeService.getNodeDepth(treeClone, node);
            node.isExpanded = false;
            node.isVisible = node.depth === 0;
            node.childrenCounter = node.childrenCounter || ~~node.children?.length;
            node.isBusy = node.isBusy || false
        });
        return treeClone;
    }
}
