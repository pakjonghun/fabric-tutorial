function initCanvas(id) {
  return new fabric.Canvas(id, {
    width: 500,
    height: 500,
    selection: false,
    backgroundColor: "red",
  });
}

function initProperty() {
  //   fabric.Object.cornerControl = "white";
  //   fabric.Object.borderColor = "white";
  //   fabric.Object.borderWidth = 20;
  //   fabric.Object.cornerColor = "black";
  //   fabric.Object.padding = 20;
}

function setBackground(url, canvas) {
  fabric.Image.fromURL(url, function (img) {
    canvas.setBackgroundImage(img, function () {
      canvas.renderAll();
    });
  });
}

function toggleMode(mode) {
  if (currentMode === mode) {
    currentMode = "";

    if (mode === modes.draw) {
      canvas.isDrawingMode = false;
      canvas.renderAll();
    }
  } else {
    currentMode = mode;

    if (mode === modes.draw) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = 5;
      canvas.renderAll();
    }
  }
}

function setPanEvent(canvas) {
  canvas.on("mouse:move", (event) => {
    if (isMouseClick && currentMode === modes.pan) {
      const e = event.e;
      canvas.setCursor("grab");
      canvas.renderAll();
      const delta = new fabric.Point(e.movementX, e.movementY);
      canvas.relativePan(delta);
    }
  });

  canvas.on("mouse:down", () => {
    if (currentMode === modes.pan) {
      isMouseClick = true;
      canvas.setCursor("grab");
      canvas.renderAll();
    }
  });

  canvas.on("mouse:up", () => {
    isMouseClick = false;
    canvas.setCursor("default");
    canvas.renderAll();
  });
}

function setDrawEvent(canvas) {
  const colorPicker = document.getElementById("colorPicker");
  colorPicker.addEventListener("change", (event) => {
    color = event.target.value;
    console.log(color);
    canvas.freeDrawingBrush.color = color;
    canvas.renderAll();
  });
}

function clearCanvas(canvas, svgState) {
  svgState.val = canvas.toSVG();
  canvas.getObjects().forEach((object) => {
    if (object !== canvas.backgroundImage) {
      console.log("delete", object);
      canvas.remove(object);
    }

    canvas.renderAll();
  });
}

function restoreCanvas(canvas, svgState, bgUrl) {
  if (svgState.val) {
    fabric.loadSVGFromString(svgState.val, function (objects) {
      const filteredObjects = objects.filter((object) => {
        console.log(object, bgUrl);
        return object["xlink:href"] !== bgUrl;
      });

      canvas.add(...filteredObjects);
      canvas.requestRenderAll();
    });
  }
}

function addRect(canvas) {
  const { left, top } = canvas.getCenter();
  const rect = new fabric.Rect({
    width: 50,
    height: 50,
    fill: color,
    left,
    top: -25,
    originX: "center",
    originY: "center",
    cornerControl: "white",
    objectCaching: false,
  });

  canvas.add(rect);
  canvas.renderAll();
  rect.animate("top", canvas.height - 25, {
    onChange: canvas.renderAll.bind(canvas),
    duration: 1000,
    easing: fabric.util.ease.easeInBack,
    onComplete: () => {
      rect.animate("top", top, {
        onChange: canvas.renderAll.bind(canvas),
        easing: fabric.util.ease.easeInBack,
        duration: 200,
      });
    },
  });

  rect.on("selected", () => {
    rect.set("fill", "white");
    //renderAll 대기중 작업이 있으면 render안함
    //requestRenderAll  있으면 render안함
    canvas.requestRenderAll();
  });

  rect.on("deselected", () => {
    rect.set("fill", color);
    canvas.requestRenderAll();
  });
}

function addCircle(canvas) {
  const { left, top } = canvas.getCenter();
  const circle = new fabric.Circle({
    radius: 25,
    fill: color,
    left,
    top,
    originX: "center",
    originY: "center",
    objectCaching: false,
  });
  canvas.add(circle);
  canvas.renderAll();
}

function makeGroup(canvas, group) {
  const objects = canvas.getObjects();
  group.val = new fabric.Group(objects, { cornerColor: "white" });
  clearCanvas(canvas, svgState);
  canvas.add(group.val);
  canvas.requestRenderAll();
}

const unGroup = (canvas, group) => {
  group.val.destroy();
  const objects = group.val.getObjects();
  canvas.remove(group.val);
  canvas.add(...objects);
  canvas.requestRenderAll();
  group.val = null;
};

let color = "#000000";
let isMouseClick = false;
let currentMode = "";
const bgUrl =
  "https://imagedelivery.net/0ZP-N9B45ji28JoChYUvWw/19e86dec-7390-4899-8435-44b712de4800/500x500";
const svgState = {};
const group = {};
const modes = {
  pan: "pan",
  draw: "draw",
};

const reader = new FileReader();
const canvas = initCanvas("canvas");
// initProperty();

setBackground(bgUrl, canvas);
setPanEvent(canvas);
setDrawEvent(canvas);
setFileInputEvent(reader);

function setFileInputEvent(reader) {
  const imgFile = document.getElementById("imgFile");
  imgFile.addEventListener("change", (event) => {
    const file = event.target.files[0];
    reader.readAsDataURL(file);
  });
}

function readFile(canvas) {
  fabric.Image.fromURL(reader.result, function (img) {
    canvas.add(img);
    canvas.requestRenderAll();
  });
}

reader.addEventListener("load", () => readFile(canvas));
