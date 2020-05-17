import { fromObject, Observable } from "tns-core-modules/data/observable";

Observable.prototype.addListener = function (eventNames, callback, thisArg) {
  this.on(eventNames, callback, thisArg);
};

Observable.prototype.removeListener = function (eventNames, callback, thisArg) {
  this.off(eventNames, callback, thisArg);
};

Observable.prototype.emit = function (eventNames, thisArg) {
  this.notify({
    eventName: eventNames,
    object: null
  });
};

class Node {
  constructor(nodeName) {
    this.emitter = fromObject({});
    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);
    this._checkEmitter = this._checkEmitter.bind(this);

    this.style = {};
    this.className = {
      baseVal: "",
    };
    this.nodeName = nodeName;
  }

  get ownerDocument() {
    return window.document;
  }

  _checkEmitter() {
    if (
      !this.emitter ||
      !(
        this.emitter.on ||
        this.emitter.addEventListener ||
        this.emitter.addListener
      )
    ) {
      this.emitter = fromObject({});
    }
  }

  addEventListener(eventName, listener, thisArg) {
    this._checkEmitter();
    thisArg = thisArg || this;
    if (this.emitter.on) {
      this.emitter.on(eventName, listener, thisArg);
    } else if (this.emitter.addEventListener) {
      this.emitter.addEventListener(eventName, listener, thisArg);
    } else if (this.emitter.addListener) {
      this.emitter.addListener(eventName, listener, thisArg);
    }
  }

  removeEventListener(eventName, listener, thisArg) {
    this._checkEmitter();
    thisArg = thisArg || this;
    if (this.emitter.off) {
      this.emitter.off(eventName, listener, thisArg);
    } else if (this.emitter.removeEventListener) {
      this.emitter.removeEventListener(eventName, listener, thisArg);
    } else if (this.emitter.removeListener) {
      this.emitter.removeListener(eventName, listener, thisArg);
    }
  }

  appendChild() {}
  insertBefore() {}
  removeChild() {}
  setAttributeNS() {}

  getBoundingClientRect() {
    return {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
}

export default Node;
