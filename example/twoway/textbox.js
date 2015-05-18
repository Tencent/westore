var Textbox = function (text, type, renderTo) {
    this.parent = document.querySelector(renderTo);
    this.text = text;
    this.type = type;
    this.render();
}
Textbox.prototype = {
    render: function () {
        if (this.node) this.parent.removeChild(this.node);

        this.parent.innerHTML += ' <input type="text" class="form-control" value="' + this.text + '"/>';
        this.node = this.parent.lastChild;
        this.node.__textboxInstace = this;
        this.node.onkeyup = function () {
            var is = this.__textboxInstace;
            if (is[is.type](this.value)) {
                is._preText = is.text = this.value;
                delete is;
            } else {
                alert("类型不匹配");
            }

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
    },
    number: function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}