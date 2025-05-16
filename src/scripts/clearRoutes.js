import { viewer } from "./displayMap";
import gsap from "gsap";

const clearRoutes = () => {
    viewer.entities.removeAll();
    gsap.to('#routeClear', {opacity: 0, pointerEvents: 'none', duration: 0.2});
}

export {clearRoutes}