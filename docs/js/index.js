import cssFlipper from '../../dist/cssflipper.esm.js';

console.log("scripts.js loaded");

const toggle = document.querySelector(".toggle");

let from = "block";
let to = "second-block";

const target = document.querySelector("[data-target=target]");

toggle.addEventListener("click", function() {
  let tween = cssFlipper({
    target: "[data-target=target]",
    from: from,
    to: to,
    duration: 1000,
    easing: [0.2, 0, 0, 1]
  });

  from = from === "block" ? "second-block" : "block";
  to = to === "second-block" ? "block" : "second-block";
});