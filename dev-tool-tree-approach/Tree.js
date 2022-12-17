import { createResource, getOwner } from "solid-js";

export default class OwnershipTree {
    constructor(owner, path) {
        this.name = this.getName(owner);

        this.path = path ? path : 'getOwner()';

        this.children = this.getChildren(owner);

        this.sourceMap = this.getSourceMap(owner);

        this.sources = this.getSources(owner);

    }

    //this method gets the children for a particular owner. 
    //it is invocted in the constructor, and it effectively builds the entire ownership tree

    getName(owner) {
        if (owner?.name) return owner.name; 
    }

    getSources(owner) {
            if (owner?.sources) return owner.sources;    
    }

    getChildren(owner) {
        const childArray = [];
            if (owner?.owned) {
                for (const key in owner.owned) {
                    const child = owner.owned[key];
                    const childPath = this.path + `.owned[${key}]`
                    if (child) {
                        childArray.push(new OwnershipTree(child, childPath))
                    }
                }
            }
        return childArray;
    }
    
    //this method gets the sourcemap for a particular owner. 
    //it is invocted in the constructor
    getSourceMap(owner) {
        const listOfSignals = [];
            if (owner?.sourceMap) {
                const srcMap = owner.sourceMap; 
                for (const key in srcMap) {
                    //this means it's a regular signal
                    if (srcMap[key].name) {
                        let sourcePath = this.path + `.sourceMap.${key}`; 
                        listOfSignals.push({
                            name: srcMap[key].name,
                            value: srcMap[key].value, 
                            path: sourcePath,
                            store: false
                        })
                    }
                    //this means it's a store
                    else {
                        let sourcePath = this.path + `.sourceMap.${key}.value`; 
                        listOfSignals.push({
                            name: srcMap[key].value["Symbol(store-name)"],
                            value: srcMap[key].value, 
                            path: sourcePath,
                            store: true
                        })
                    }
                }
            return listOfSignals
        }
    }


    //This method parses the entire ownership tree, looks for signals and pushes them onto an array. 
    //it will gather all of the signals that are within components
    parseSourceMap(stack = []) {
        //searches a particular owner for sources
            if (this.sourceMap?.length > 0) {
                this.sourceMap.forEach(source => {
                        stack.push(source)
                })
            }
        //moves on to the next child and recursively runs the search function on every child node in the tree
        if (this.children) {
            if (this.children.length > 0) {
                this.children.forEach(child => {
                    if (child) {
                        child.parseSourceMap(stack)
                    }
                })
            }
        }

        return stack;
    }

    //still a work in progress. This method will be used to find signals that are outside of the owner components
    parseSources(stack = []) {
        if (this.sources?.length > 0) {
            this.sources.forEach(source => {
                //inspect s9 more...seems to relate to rendered components 
                //but for now we can ignore it
                // if (source.name && source.name === 's9') return 
                // else {
                    stack.push(source)
                // }
            })
        }
        //moves on to the next child and recursively runs the search function on every child node in the tree
            if (this.children?.length > 0) {
                this.children.forEach(child => {
                    if (child) {
                        child.parseSources(stack)
                    }                
                })
            }
        return stack
    }
}
