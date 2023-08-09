import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import * as O from 'fp-ts/lib/Option'
import { pipe } from "fp-ts/lib/function";
import { NodeInTree, SearchableNode, Node } from '../../models/node.model';

@Injectable({
    providedIn: 'root'
})
export class TreeService {

    /**
     * Traverse a tree data structure and applies the provided @param f function
     * to all nodes
     * @param root the tree to be traversed
     * @param f the function to be applied to all nodes
     * N.B. this function modifies the existing tree
     */
    traverse<K extends Node>(root: K, f: (node: K) => void): void {
        this._traverse(root, (node: K) => {
            f(node);
            return true;
        });
    }

    /**
     * Search a tree for a node with the provided @param id
     * @param root the tree to be searched
     * @param id the id of the node to be retrieved
     */
    searchById<T, K extends SearchableNode<T>>(root: K, id: string): O.Option<NodeInTree<T>> {
        let matchingNode: K;
        const pathToRoot: { [k: string]: K } = {};
        this._traverse(root, (node: K) => {
            node.children?.forEach(child => {
                pathToRoot[child._id] = node;
            });
            if (node._id === id) {
                matchingNode = node;
            }
            return node._id !== id;
        });
        return matchingNode ? O.some({
            _id: matchingNode._id,
            value: matchingNode.value,
            children: matchingNode.children,
            pathToRoot: this.buildPath(id, pathToRoot)
        }) : O.none;
    }

    getById<T, K extends SearchableNode<T>>(root: K, id: string): SearchableNode<T> {
        let matchingNode: K;
        this._traverse(root, (node: K) => {
            if (node._id === id) {
                matchingNode = node;
            }
            return node._id !== id;
        });
        return matchingNode;

    }

    /**
     * Internal function that can be used to traverse or search the tree
     * @param root the tree to be scanned
     * @param f an optional function to be applied to all nodes
     */
    private _traverse<T, K extends Node>(root: K, f: (node: K) => boolean): void {
        if (!f(root)) {
            return;
        }
        root.children?.forEach(c => this._traverse(c, f));
    }

    /**
     * Given a @param root tree and a @param node node, calculate the
     * depth of the node in the tree
     * @param root the tree
     * @param node the node we want to calculate the depth of
     */
    getNodeDepth<T, K extends SearchableNode<T>>(root: K, node: K): number {
        return pipe(
            this.searchById(root, node._id),
            O.fold(() => -1, n => n.pathToRoot.length)
        )
    }

    /**
     * Flatten a @param root tree into a list of its nodes
     * @param root the tree to be flattened
     */
    flatten<T, K extends Node>(root: K): K[] {
        const result = [cloneDeep(root)];
        for (const node of result) {
            if (node.children) {
                result.splice(result.indexOf(node) + 1, 0, ...node.children as K[]);
            }
        }
        return result;
    }

    /**
     * Internal function used to build the pathToRoot of a node in a tree
     * @param id the id of the node
     * @param pathMap the pathMap returned by searchById
     */
    private buildPath<T, K extends SearchableNode<T>>(id: string, pathMap: { [k: string]: K }): K[] {
        const pathToRoot = [];
        let key = id;
        while (key) {
            if (pathMap[key]) {
                pathToRoot.push(pathMap[key]);
                key = pathMap[key]._id;
            } else {
                key = null;
            }
        }
        return pathToRoot;
    }

}