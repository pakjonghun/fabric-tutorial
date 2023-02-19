## 개요

- fabric 기본적인 내용을 학습한다.
- 내용 : youtube fabric 영상을 보고 따라함

## 내용

- renderAll 보다는 requestRenderAll 이 최적화에 더 좋다
- doc 에 소개되지 않은 event 와 메서드가 꽤 있다 구글링이 필요함
- 튜토리얼에서는 freeBrush, deSelected 이벤트를 다루고 있음.

  ```
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

      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = 5;
      canvas.renderAll();
  ```

- originX originY 는 object 의 어느곳을 그 좌표에 위치 시킬지 에 대한 기능이다
- 이벤트 세분화가 되 있지 않아서 모드 클레스를 별도로 만들어서 관리 하는것이 필요하다.

```
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
```

- 파일관련 또 다른 관리 객체를 다뤄 볼 수 있어서 좋았다.
- 세부내용은 fileReader mdn 에 다 있고,
- url 이 memory에 저장해서 불러와서 캔버스에서 로드 하는 방식으로 작동한다.

  ```

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

      const reader = new FileReader();
      setFileInputEvent(reader);


      reader.addEventListener("load", () => readFile(canvas));
  ```
