// CSS transition powered FLIP Animation function that allows tweening classes
const cssFlipper = ({
  target,
  from,
  to,
  duration = 500,
  easing = [0.77, 0.5, 0.175, 1],
} = {}) => {
  // check if target is a valid dom node or valid dom selector
  const isElement = element =>
    element instanceof Element || element instanceof HTMLDocument;

  const targetObject = target => {
    if (isElement(target)) {
      return target;
    } else {
      return document.querySelector(target);
    }
  };

  if (!isElement(targetObject(target))) {
    console.error("cssFlipper --> please specify a target");
    return;
  }

  // console.log(target);

  // Convert duration to string;
  duration = duration * 0.001 + "s";

  const el = targetObject(target);

  // Check if is animating already and bail if it is
  if (el.classList.contains("is-flipping")) {
    console.log("cssFlipper is animating -->", el);
    return;
  }

  // Returns the transform rotated value in degrees
  const getAngle = el => {
    // Get the rotated value of transform
    const elStyle = window.getComputedStyle(el);
    const elMatrix =
      elStyle.getPropertyValue("transform") != "none"
        ? elStyle.getPropertyValue("transform")
        : "matrix(0,0,0,0,0,0)";
    const values = elMatrix
      .split("(")[1]
      .split(")")[0]
      .split(",");
    const a = values[0];
    const b = values[1];
    // pass this value into the animation function to the from position
    const elAngle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

    return elAngle;
  };

  // Add data prop to show that it its animating
  el.classList.add("is-flipping");

  // Get initial position
  const fromAngle = getAngle(el);
  // Reset the angle so that el rect top and left are correct
  el.style.transform = `rotate(0)`;
  const fromRect = el.getBoundingClientRect();
  // Remove the rotate(0) inline style so it doesn't override the from class properties;

  //  // Testing out offset width and height instead of rect values
  //  fromRect.height = el.offsetHeight;
  //  fromRect.width = el.offsetWidth;

  el.removeAttribute("style");

  console.log("from Angle -->", fromAngle);

  // Listen for transition end event to remove left over inline styles and data attribute
  el.addEventListener("transitionend", function() {
    this.removeAttribute("style");
    this.classList.remove("is-flipping");
  });

  // Check if the easing is a cubic-bezier
  if (typeof easing == "object") {
    easing = `cubic-bezier(${easing[0]},${easing[1]},${easing[2]},${
      easing[3]
    })`;
  }

  // Remove any transition that might be applied
  el.style.transition = "none";

  // Swap the classes
  el.classList.remove(from);
  el.classList.add(to);

  // Get second positon
  const toAngle = getAngle(el);
  console.log("toAngle -->", toAngle);
  // Reset the angle so that el rect top and left are correct
  el.style.transform = `rotate(0)`;
  const toRect = el.getBoundingClientRect();

  // // Testing out offset width and height instead of rect values
  // toRect.height = el.offsetHeight;
  // toRect.width = el.offsetWidth;

  // Invert all the positions
  const invertedRect = {
    top: fromRect.top + fromRect.height / 2 - (toRect.top + toRect.height / 2),
    left: fromRect.left + fromRect.width / 2 - (toRect.left + toRect.width / 2),
    width: fromRect.width / toRect.width,
    height: fromRect.height / toRect.height,
  };

  // Set the transform origin point so it works with the calculated co-ordinates
  el.style.transformOrigin = "center center";

  // Apply transform to sync the new position back to the first one
  el.style.transform = `translateX(${invertedRect.left}px) translateY(${
    invertedRect.top
  }px) rotateZ(${fromAngle}deg) scaleX(${invertedRect.width}) scaleY(${
    invertedRect.height
  })`;

  // // Force a repaint
  // // This is important
  void el.offsetHeight;

  // Set the transition duration and easing
  el.style.transition = `transform ${duration} ${easing}`;

  // Remove the transforms so the element can transition back to the new position
  el.style.transform = `translateX(0) translateY(0) rotateZ(${toAngle}deg) scale(1)`;
};

export default cssFlipper;

// TODO:
// Put in a target selector that is seperate to the tweening classes
// Use this as a reference to the element.

// find way to calculate the objects coordinates midway through a transition and account for the rotaion changing top and left props.

// Allow for 3D transform's/coordinates

// Use a 3D matrix instead of individual transform properties.

// Allow for tweening of other properties
//  opacity?
//  border-radius?
//  atomatically detect any properties that are different?

// Automatically detect the transform origin of target elements and calculate positions based on that.
//    Animate the transform origin as well?

// Allow for a callback functions or custom event emitter on transition start and finish

// Add class when flip animation has finished to apply transitions

// Seperate getting the co-ordinates, the function in between and setting the new co-ordinates so they can be used individually.
