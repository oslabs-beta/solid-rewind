import { getOwner } from "solid-js";

export default class OwnershipTree {
    constructor(owner, path) {
        this.name = this.getName(owner);

        this.path = path ? path : '';

        this.children = this.getChildren(owner);

        this.sourceMap = this.getSourceMap(owner);

        this.sources = this.getSources(owner);

    }

    //this method gets the name for a particular owner. 
    //it is invocted in the constructor
    getName(owner) {
        if (owner?.name) return owner.name; 
    }

    //this method gets the children for a particular owner. 
    //it is invoked in the constructor
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
    }

    
    //this method gets the sourcemap for a particular owner. 
    //it is invoked in the constructor
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

    //this method gets the sources (not the sourceMap) for a particular owner. 
    //it is invoked in the constructor
    getSources(owner) {
        if (owner?.sources) return owner.sources;    
    }

    /*
    This method parses the entire ownership tree, looking at the sourceMap
    for signals and pushes them onto an array. 
    it will gather all of the signals that are within components and contained within the sourceMap
    we're abandoning it right now in favor of searching through sources
    */
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

    //this method parses the source key of every owner on our owner tree
    //it returns an array of all of the relevant sources 
    parseSources(stack = {}) {
        if (this.sources?.length > 0) {
            for (let i = 0; i < this.sources.length; i++) {
                const source = this.sources[i]
                    //this helps us track down the source 
                    let sourcePath = this.path + `.sources[${i}]`

                    //inspect s9 more...seems to relate to rendered components 
                    //but for now we can ignore it
                    if (source.name && source.name === 's9') continue;
                    //comparator seems to be a function that allows these signals/components know if they need to re-render
                    //everything that gets rendered appears to  have a comparator key
                    if (source.comparator) {
                        //the following if block find pure signals made with create signal
                        if (source?.name[0].toString() == 's') {
                            stack[source.name] = {
                                name: source.name,
                                value: source.value, 
                                path: sourcePath,
                                type: "signal",
                                underlyingSource: source
                            }
                        }
                        else if (source?.sourceMap) {
                            sourcePath += '.sourceMap'
                            for (const key in source.sourceMap) {
                                if (!stack[key]) {
                                    stack[key] = {
                                        name: key,
                                        value: source.value, 
                                        path: sourcePath + `[${key}]`,
                                        type: 'store',
                                        underlyingSource: source.sourceMap[key]
                                    }
                                }
                                
                            } 
                    } 
                    // else console.log(source)
            }
        }
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

