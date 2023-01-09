export default class OwnershipTree {
    constructor(owner, path) {
        this.name = this.getName(owner);
        this.path = path ? path : '';
        this.children = this.getChildren(owner);
        this.sourceMap = this.getSourceMap(owner);
        this.sources = this.getSources(owner);
    }

    //this method gets the name for a particular owner. 
    //it is invoked in the constructor
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
        }
        return childArray;
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

    //this method parses the source key of every owner on our owner tree
    //it returns an object of all of the relevant sources 
    parseSources(stack = {}, sourceMapSources = {}) {

        // uncomment if we want to explore sourceMap features
        // if (this.sourceMap?.length > 0) {
        //     this.sourceMap.forEach(source => {
        //         sourceMapSources[source.name] = source;
        //     })
        // }


        if (this.sources?.length > 0) {
            for (let i = 0; i < this.sources.length; i++) {
                const source = this.sources[i]
                    //this helps us track down the source 
                    let sourcePath = this.path + `.sources[${i}]`

                    //inspect s9 more...seems to relate to rendered components 
                    //but for now we can ignore it

                    //''''consider adding this back if s9 proves unhelpful
                    // if (source.name && source.name === 's9') continue;

                    //comparator seems to be a function that allows these signals/components know if they need to re-render
                    //everything that gets rendered appears to  have a comparator key

                    //'''''consider adding
                    // if (source.comparator) {

                    /*
                    the following if block finds pure signals made with create signal. Sometimes signals
                    can have the same signal name, even if they're in different components (for example, if a single
                    signal is a passed down to multiple child components). If we find a signal that goes by the
                    same name as the signal already in our stack, we check if that signal is being observed by the exact same components
                    If not, we know it's a unique signal and we add it to our stack at the relevant key
                    */
                    if (source?.name && source.name[0].toString() == 's') {
                        //initially, the stack's values will be an array of signals. Each signal in
                        // the respective array will have the same name, but a unique set of observers
                        if (!stack[source.name]) stack[source.name] = [];
                        let observerString = ''
                        if (source.observers) {
                            const observers = source.observers;
                            for (const obs of observers) {
                                observerString += (obs.name + '|||'); 
                            }
                        }
                    
                    if (stack[source.name].every(el => el.observerString !== observerString)) {
                        stack[source.name].push({
                            name: source.name,
                            value: source.value, 
                            path: sourcePath,
                            type: "signal",
                            observerString: observerString,
                            underlyingSource: source
                        })
                    }
                }
            }
        }

        //moves on to the next child and recursively runs the search function on every child node in the tree
        if (this.children?.length > 0) {
            this.children.forEach(child => {
                if (child) {
                    child.parseSources(stack, sourceMapSources)
                }                
            })
        }

        const returnObj = {};
        
        //flattens the existing stack of signals
        for (const keys of Object.values(stack)) {
            keys.forEach((el, idx) => returnObj[el.name + "%%%" + idx] = el)
        }

    return Object.keys(sourceMapSources).length ? {sources: returnObj, sourceMaps: sourceMapSources} : returnObj;

    }
    
}

