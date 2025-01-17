/** @typedef {import('p5')} p5 */
import p5plotSvg from "p5.plotsvg";

export const mySketch = (/** @type {p5} */ p) => {
  p.disableFriendlyErrors = true;
  let bDoExportSvg = false;

  let canvasWidth = 5.5 * 96;
  let canvasHeight = 8.5 * 96;

  let centralHeartSizeSlider;
  let centralHeartAbbSlider;
  let smallHeartSizeSlider;

  let numPointsCentralHeartInput;
  let numPointsSmallHeartInput;

  // numSteps determines how many points in a path
  function rangey(start, end, numSteps) {
    const seq = [];

    let totalRange = Math.abs(start) + Math.abs(end);
    let step = totalRange / numSteps;

    if (start > end) {
      for (let i = start; i >= end; i -= step) {
        seq.push(i);
      }
    } else if (start < end) {
      for (let i = start; i <= end; i += step) {
        seq.push(i);
      }
    } else {
      throw new Error("Invalid range");
    }

    return seq;
  }

  // Function that plots topHalf of a heart
  // size scales heart
  // range of x is [2, -2]
  // We multiply y by -size to scale and flip the shape
  let topHalfPointFn = (x, size) =>
    Math.sqrt(1 - Math.pow(Math.abs(x) - 1, 2)) * -size;

  // Function that plots bottomHalf of a heart
  // size scales heart
  // range of x is [2, -2]
  // We multiply y by -size to scale and flip the shape
  let bottomHalfPointFn = (x, size) =>
    (Math.acos(1 - Math.abs(x)) - p.PI) * -size;

  // Draws Small Holzapfel's Heart Using Provided Points
  function drawHolzapfelsHeart(points) {
    p.beginShape();
    for (const point of points) {
      p.vertex(point[0], point[1]);
    }
    p.endShape(p.CLOSE);
  }

  // Function that creates a list of points that form a heart shape in the center of the canvas

  /**
   * Function that creates a list of points that form a heart shape in center of the canvas
   *
   * @param {number} size - Size of heart
   * @param {number} originX - X Coordinate Origin
   * @param {number} originY - Y Coordinate Origin
   * @param {number[]} topHalfRange - Array of numbers from [2, -2]. Defines top half of heart
   * @param {number[]} bottomHalfRange - Array of numbers from [2, -2]. Defines bottom half of heart
   * @returns {number[][]} - An array of x, y coordinates that represents the path of the heart
   */
  function holzapfelsHeartCurvePath(
    size,
    originX,
    originY,
    topHalfRange,
    bottomHalfRange,
  ) {
    let points = [];

    // Points that make up top of heart
    for (const x of topHalfRange) {
      let y = topHalfPointFn(x, size);
      // Need to multiply x by size to scale it to match y's scale
      points.push([x * size + originX, y + originY]);
    }

    // Draw bottom half of heart
    for (const x of bottomHalfRange) {
      let y = bottomHalfPointFn(x, size);
      points.push([x * size + originX, y + originY]);
    }

    return points;
  }

  p.keyPressed = function (/** @type {KeyboardEvent} */ e) {
    // Press 's' to save an SVG file of the current plot
    if (e.key == "s") {
      bDoExportSvg = true;
    } else if (e.key == " ") {
      p.loop();
    }
  };

  // Calling p5.js functions, using the variable 'p'
  p.setup = () => {
    p.background(255);
    p.noFill();

    p.createCanvas(canvasWidth, canvasHeight); // 5.5"x8.5" at 96 dpi

    centralHeartSizeSliderLabel = p.createElement("label", "Center Heart Size");
    centralHeartSizeSlider = p.createSlider(30, 200, 150);
    centralHeartSizeSlider.size(100);
    centralHeartSizeSliderLabel.child(centralHeartSizeSlider);

    centralHeartAbbSliderLabel = p.createElement(
      "label",
      "Center Heart Abberation",
    );
    centralHeartAbbSlider = p.createSlider(0, 0.5, 0, 0);
    centralHeartAbbSlider.size(100);
    centralHeartAbbSliderLabel.child(centralHeartAbbSlider);

    smallHeartSizeSliderLabel = p.createElement("label", "Small Heart Size");
    smallHeartSizeSlider = p.createSlider(1, 50, 20, 0);
    smallHeartSizeSlider.size(100);
    smallHeartSizeSliderLabel.child(smallHeartSizeSlider);

    numPointsCentralHeartInputLabel = p.createElement(
      "label",
      "num points central heart",
    );
    numPointsCentralHeartInput = p.createInput(35, "number");
    numPointsCentralHeartInputLabel.child(numPointsCentralHeartInput);

    numPointsSmallHeartInputLabel = p.createElement(
      "label",
      "num points small heart",
    );
    numPointsSmallHeartInput = p.createInput(56, "number");
    numPointsSmallHeartInputLabel.child(numPointsSmallHeartInput);
  };

  p.draw = () => {
    p.background(255);
    p.strokeWeight(3);
    // Length of topHalfRange + bottomHalfRange = total # of points in center heart = 160
    let topHalfCenterHeartRange = rangey(
      -2,
      2,
      numPointsCentralHeartInput.value(),
    );
    let bottomHalfCenterHeartRange = rangey(
      2,
      -2,
      numPointsCentralHeartInput.value(),
    );

    // Length of topHalfRange + bottomHalfRange = total # of points in small heart = 40
    let topHalfSmallHeartRange = rangey(
      -2,
      2,
      numPointsSmallHeartInput.value(),
    );
    let bottomHalfSmallHeartRange = rangey(
      2,
      -2,
      numPointsSmallHeartInput.value(),
    );

    let centerHeartPathPoints = holzapfelsHeartCurvePath(
      centralHeartSizeSlider.value(),
      canvasWidth / 2,
      canvasHeight / 3.5,
      topHalfCenterHeartRange,
      bottomHalfCenterHeartRange,
    );
    let abb = centralHeartAbbSlider.value(); // % abberation for each point
    centerHeartPathPoints = centerHeartPathPoints.map((point) => {
      // adds abberation to all points
      let abbValueX = p.random(1 - abb, 1 + abb);
      let abbValueY = p.random(1 - abb, 1 + abb);
      return [point[0] * abbValueX, point[1] * abbValueY];
    });

    if (bDoExportSvg) {
      // Begin exporting, if requested
      p5plotSvg.beginRecordSVG(this, "heart-of-hearts.svg");
    }

    // Draw a small heart at every point in the centerHeartPathPoints arr
    for (const point of centerHeartPathPoints) {
      // generate points of smaller heart
      let smallHeartPoints = holzapfelsHeartCurvePath(
        smallHeartSizeSlider.value(),
        point[0],
        point[1],
        topHalfSmallHeartRange,
        bottomHalfSmallHeartRange,
      );

      drawHolzapfelsHeart(smallHeartPoints);
    }

    if (bDoExportSvg) {
      // End exporting, if doing so
      p5plotSvg.endRecordSVG();
      bDoExportSvg = false;
    }

    p.noLoop();
  };
};
