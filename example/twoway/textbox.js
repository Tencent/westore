var Textbox = function (text, renderTo) {
    this.parent = document.querySelector(renderTo);
    this.text = text;
    this.render();
}
Textbox.prototype = {
    render: function () {
            if (this.node) this.parent.removeChild(this.node);
            this.parent.innerHTML += ' <input type="text" class="form-control" value="' + this.text + '"/>';
            this.node = this.parent.lastChild;
            this.node.__textboxInstace = this;
            this.node.onkeyup= function () {
                this.__textboxInstace._preText = this.__textboxInstace.text = this.value;
                delete this.__inputContorlInstace;
            }
    },
    update: function () {
        this.node.value = this.text;
    },
    tick: function () {
        if (this._preText !== this.text) {
            this._preText = this.text;
            this.update();
        }
    }
}