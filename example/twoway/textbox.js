var Textbox = function (text, renderTo) {
    this.parent = document.querySelector(renderTo);
    this.text = text;
    this.render();
}
Textbox.prototype = {
    render: function () {
        if (this.checkChange()) {
            if (this.node) this.parent.removeChild(this.node);
            this.parent.innerHTML += ' <input type="text" class="form-control" value="' + this.text + '"/>';
            this.node = this.parent.lastChild;
            this.node.__textboxInstace = this;
            this.node.onkeyup= function () {
                this.__textboxInstace._preText = this.__textboxInstace.text = this.value;
                delete this.__inputContorlInstace;
            }
        }
    },
    checkChange: function () {
        if (this._preText === this.text) return false;
        this._preText = this.text;
        return true;
    }
}