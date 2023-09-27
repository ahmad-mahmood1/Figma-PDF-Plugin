import { CLOSE_PLUGIN, CONVERT_FRAMES, NO_FRAMES_ON_PAGE } from "./constants";
import { frameSortByName } from "./utils/helperFunctions";
import { exportType, message } from "../types";

figma.showUI(__html__, { visible: false });

figma.ui.onmessage = (message: message) => {
  console.log("===  message:", message);
  if (message.type === CLOSE_PLUGIN) {
    figma.closePlugin();
  }

  if (message.type === CONVERT_FRAMES) {
    let format: exportType = message.data;
    convertFramesToExport(format);
  }
};

let generateExport = (format: exportType) => async (node: SceneNode) => {
  let settings:
    | ExportSettingsImage
    | ExportSettingsSVGString
    | ExportSettingsSVG;

  if (format === "PNG") {
    settings = { format, constraint: { type: "SCALE", value: 1.2 } };
  }
  if (format === "SVG") {
    settings = { format };
  } else {
    settings = { format };
  }

  let data = await node.exportAsync(settings as ExportSettings);

  return {
    data,
    width: node.width,
    height: node.height,
    orientation: node.width > node.height ? "l" : "p",
  };
};

async function convertFramesToExport(format: exportType) {
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

    //move sorted nodes at x:0,y:0

    // let startingX = 0;
    // let startingY = 0;

    // let runningWidth = 0;

    // nodes.forEach((node, i) => {
    //   node.x = startingX + runningWidth;
    //   node.y = startingY;

    //   runningWidth += node.width + 400;
    // });

    let exportArray = await Promise.all(nodes.map(generateExport(format)));
    figma.ui.postMessage({ type: format, data: exportArray });
  } catch (e) {
    alert(e);
  }
}
