"use strict";

class ExpandControl {
  constructor() {
    this.expandList = new Set();
    this.toggleTimeout = null;
    this.animateTime = 200;
  }

  Reset() {
      this.expandList = new Set();
  }

  AutoHeightAnimate(element, time) {
    element.css("display", "block");
    const curHeight = element.height();
    const autoHeight = element.css("height", "auto").height();
    element.height(curHeight); // Reset to Default Height
    element.stop().animate({ height: autoHeight }, time); // Animate to Auto Height
  };

  CollapseAnimate(element, time) {
    element.stop().animate({ height: "0" }, time);
    return setTimeout(function() { element.css("display", "none"); }, time);  // Once the animation completes, remove the element from the DOM layout
  };

  Toggle(element, name) {
    let more = element.find("#more-details");
    if (!more.length)
      return;
  
    clearTimeout(this.toggleTimeout);
    if (element.hasClass("more-collapsed")) {
      this.AutoHeightAnimate(more, this.animateTime);
      this.expandList.add(name);
    } else {
      this.toggleTimeout = this.CollapseAnimate(more, this.animateTime);
      this.expandList.delete(name);
    }
    element.toggleClass("more-collapsed");
  };
  
  IsExpanded(name) {
    return this.expandList.has(name);
  }
}

// It's global, but meh.
var EXPANDED = new ExpandControl();