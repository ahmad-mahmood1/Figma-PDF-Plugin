import {
  CLOSE_PLUGIN,
  GENERATE_FRAME_IMAGES,
  NO_FRAMES_ON_PAGE,
} from "./constants";
import { frameSortByName } from "./helperFunctions";

figma.showUI(__html__, { visible: false });

figma.ui.onmessage = (message) => {
  if (message === CLOSE_PLUGIN) {
    figma.closePlugin();
  }

  if (message === GENERATE_FRAME_IMAGES) {
    generateImages();
  }
};

async function generateImages() {
  try {
    let nodes: SceneNode[] = [];
    if (!!figma.currentPage.selection.length) {
      nodes = figma.currentPage.selection.slice();
    } else {
      nodes = figma.currentPage.children.slice();
    }

    if (nodes.length === 0) {
      figma.ui.postMessage(NO_FRAMES_ON_PAGE);
      return;
    }

    nodes = frameSortByName(nodes);
    let startingX = 0;
    let startingY = 0;

    let runningWidth = 0;

    nodes.forEach((node, i) => {
      node.x = startingX + runningWidth;
      node.y = startingY;

      runningWidth += node.width + 400;
    });

    let images = await Promise.all(
      nodes.map((node) =>
        node.exportAsync({
          format: "PNG",
          constraint: { type: "SCALE", value: 0.5 },
        })
      )
    );
    // console.log("_", images);
    figma.ui.postMessage(images);
  } catch (e) {
    console.log(e);
  }
}
