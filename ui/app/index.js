import "./htmx.js";
import p5 from "p5";
import { mySketch } from "./sketch.js";

new p5(mySketch, document.getElementById("sketch"));
