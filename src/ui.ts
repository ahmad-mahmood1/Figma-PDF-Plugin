import jsPDF from "jspdf";

import { GENERATE_FRAME_IMAGES, NO_FRAMES_ON_PAGE } from "./constants";

import { Canvg, presets } from "canvg";

onmessage = async (event) => {
  let message = event.data.pluginMessage;

  if (message === NO_FRAMES_ON_PAGE) {
    alert("No frames available");
  } else {
    const svgArr = event.data.pluginMessage;

    processSvgArrayIntoPDF(svgArr)
      .then(() => {
        sendClosePluginMessage();
      })
      .catch((e) => {
        console.log(e);
        alert(e);
        sendClosePluginMessage();
      });
  }
};

async function processSvgArrayIntoPDF(svgArr) {
  let doc: jsPDF;

  for (let i = 0; i <= svgArr.length - 1; i++) {
    let { svg, orientation, width, height } = svgArr[i];
    let format = [width, height];

    if (i === 0) {
      doc = new jsPDF({ orientation, format });
    } else {
      doc.addPage(format, orientation);
    }

    let pngURL = await toPng({ svg, width, height });

    doc.addImage(pngURL, "PNG", 0, 0, width, height);
  }

  doc.save("plugin.pdf");
}

async function toPng(data) {
  const preset = presets.offscreen();
  const { width, height, svg } = data;
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const v = await Canvg.from(ctx, svg, preset);

  await v.render();

  const blob = await canvas.convertToBlob();
  const pngUrl = URL.createObjectURL(blob);

  return pngUrl;
}

function sendClosePluginMessage() {
  parent.postMessage({ pluginMessage: "close_plugin" }, "*");
}

function sendInitMessage() {
  parent.postMessage(
    {
      pluginMessage: GENERATE_FRAME_IMAGES,
    },
    "*"
  );
}

sendInitMessage();
