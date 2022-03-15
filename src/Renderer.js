class Renderer {
    // objectList: Array<GLObject>;
    // count: number;

    constructor() {
        this.objectList = new Array()
        this.count = 0;
    }

    addObject(obj) {
        this.objectList.push(obj);
        this.count++;
    }

    removeObject(id) {
        const idx = this.objectList.findIndex(obj => obj.id === id);
        this.objectList.splice(idx, 1);
        this.count--;
    }

    render() {
        for (let obj of this.objectList) {
            obj.draw();
        }
    }
}


export default Renderer
