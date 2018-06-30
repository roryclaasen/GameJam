var Keyboard = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    A: 65,
    S: 83,
    D: 68,

    isDown: function (keyCode: number) {
        return this._pressed[keyCode];
    },

    onKeydown: function (event: any) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function (event: any) {
        delete this._pressed[event.keyCode];
    }
};

window.addEventListener('keyup', function (event) { Keyboard.onKeyup(event); event.preventDefault(); }, false);
window.addEventListener('keydown', function (event) { Keyboard.onKeydown(event); event.preventDefault(); }, false);

export default Keyboard;