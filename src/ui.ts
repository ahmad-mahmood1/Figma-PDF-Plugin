// import jsPDF from "jspdf";

import {
  CLOSE_PLUGIN,
  CONVERT_FRAMES,
  NO_FRAMES_ON_PAGE,
  SVG_STRING,
} from "./constants";

// import { exportType, message } from "../types";
// import { SVGToImage } from "./utils/svgToPng";

// onmessage = (event: message) => {
//   console.log("===  event:", event);
//   let message = event.data.pluginMessage;

//   if (message.type === NO_FRAMES_ON_PAGE) {
//     alert("No frames available");
//   } else {
//     let data = message.data;
//     let format = message.type;
//     processNodesBufferArray(format, data)
//       .then(() => {
//         sendClosePluginMessage();
//       })
//       .catch((e) => {
//         console.log(e);
//         alert(e);
//         sendClosePluginMessage();
//       });
//   }
// };

// async function processNodesBufferArray(
//   exportType: exportType,
//   processedNodeArray
// ) {
//   let doc: jsPDF;

//   for (let i = 0; i <= processedNodeArray.length - 1; i++) {
//     let { data, orientation, width, height } = processedNodeArray[i];
//     let format = [width, height];

//     if (i === 0) {
//       doc = new jsPDF({ orientation, format });
//     } else {
//       doc.addPage(format, orientation);
//     }

//     let imageData = data;
//     console.log("===  imageData:", imageData);

//     if (exportType === SVG_STRING) {
//       imageData = await SVGToImage({
//         svg: data,
//         mimetype: "image/png",
//         width: width * 2,
//         height: height * 2,
//       });
//     }
//     doc.addImage(imageData, "PNG", 0, 0, width, height);
//   }

//   doc.save("plugin.pdf");
// }

// function sendClosePluginMessage() {
//   parent.postMessage({ pluginMessage: { type: CLOSE_PLUGIN } }, "*");
// }

// function sendInitMessage() {
//   parent.postMessage(
//     {
//       pluginMessage: { type: CONVERT_FRAMES, data: SVG_STRING },
//     },
//     "*"
//   );
// }

// sendInitMessage();

function sendClosePluginMessage() {
  parent.postMessage({ pluginMessage: { type: CLOSE_PLUGIN } }, "*");
}

function sendInitMessage() {
  parent.postMessage(
    {
      pluginMessage: { type: CONVERT_FRAMES, data: SVG_STRING },
    },
    "*"
  );
}

sendInitMessage();

onmessage = (event) => {
  console.log("===  event:", event);
  let message = event.data.pluginMessage;

  if (message.type === NO_FRAMES_ON_PAGE) {
    alert("No frames available");
  } else {
    const { jsPDF } = window.jspdf;

    let doc;

    const svgArr = event.data.pluginMessage.data;

    svgArr.forEach((svgItem, i) => {
      let { svg, orientation, width, height } = svgItem;

      let format = [width, height];

      if (i === 0) {
        doc = new jsPDF({ orientation, format });
      } else {
        doc.addPage(format, orientation);
      }

      svg = svg.replace(/\r?\n|\r/g, "").trim();

      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");

      context.clearRect(0, 0, width, height);

      canvg(canvas, svg);

      let imgData = canvas.toDataURL("image/png");

      doc.addImage(imgData, "PNG", 0, 0, width, height);
    });
    doc.save("plugin.pdf");
  }

  sendClosePluginMessage();
};
