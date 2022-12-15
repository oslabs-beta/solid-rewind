import { createResource } from "solid-js";

export default class OwnershipTree {
    constructor(owner) {
        this.name = owner.name;

        this.children = this.getChildren(owner);

        this.sources = this.getSources(owner);

        this.owner = owner;
    }

    getChildren(obj) {
        const arr = [obj]
        const owner = arr.pop();     
        console.log('line 15', owner)
        const childArray = [];
        console.log("ownerowned", owner.owned)
        if (owner.owned) {
            for (const child of owner.owned) {
                console.log(child)
                childArray.push("hello")
            }
        }
        return childArray;
    }
    
    getSources(obj) {
        const arr = [obj]
        const owner = arr.pop();
        console.log(owner.owned)   
        const listOfSignals = [];
        if (owner.sourceMap) {
            const srcMap = owner.sourceMap
            for (const signal in srcMap) {
                console.log("name", srcMap[signal].name)
                console.log("calue", srcMap[signal].value)
                listOfSignals.push({name: srcMap[signal].name, value: srcMap[signal].value})
            }
        }
        
        return listOfSignals
    }
    
}
