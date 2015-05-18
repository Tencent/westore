var Label = function (text, renderTo) {
    this.parent = document.querySelector(renderTo);
    this.text = text;
    this.render();
}
Label.prototype = {
    render: function () {
        if (this.node) this.parent.removeChild(this.node);
        this.parent.innerHTML += '<label>'+this.text+'</label>';
        this.node = this.parent.lastChild;
    },
    update: function () {
        this.node.innerHTML = this.text;
    },
    tick: function () {
        if (this._preText !== this.text) {
            this._preText = this.text;
            this.update();
        }
    }
}