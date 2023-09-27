export function SVGToImage(settings) {
  let _settings = {
    svg: null,
    mimetype: "image/png",
    quality: 1,
    width: 500,
    height: 500,
  };

  // Override default settings
  for (let key in settings) {
    _settings[key] = settings[key];
  }

  return new Promise(function (resolve, reject) {
    try {
      let svgNode;

      // Create SVG Node if a plain string has been provided
      if (typeof _settings.svg == "string") {
        // Create a non-visible node to render the SVG string
        let SVGContainer = document.createElement("div");
        SVGContainer.style.display = "none";
        SVGContainer.innerHTML = _settings.svg;
        svgNode = SVGContainer.firstElementChild;
      } else {
        svgNode = _settings.svg;
      }

      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");

      let svgXml = new XMLSerializer().serializeToString(svgNode);
      console.log("===  svgXml:", svgXml)
      let svgBase64 = "data:image/svg+xml;base64," + btoa(svgXml);

      const image = new Image();

      image.onload = function () {
        // Define the canvas intrinsic size
        canvas.width = _settings.width;
        canvas.height = _settings.height;

        // Render image in the canvas
        context.drawImage(image, 0, 0, _settings.width, _settings.height);

        // Fullfil and Return the Base64 image
        resolve(canvas.toDataURL(_settings.mimetype));
      };

      // Load the SVG in Base64 to the image
      image.src = svgBase64;
    } catch (e) {
      reject(e);
    }
  });
}
