import {
  ClearOutlined,
  DownloadOutlined,
  FontColorsOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { fabric } from "fabric";
import "./Canvas.css";
import { useEffect, useRef } from "react";

function Canvas() {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    if (!fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        height: 700,
        width: 1260,
        backgroundColor: "pink",
      });
    }
  }, []);

  const addText = () => {
    const text = new fabric.IText("insira os dados", {
      fontFamily: "sans-serif",
      fontSize: 16,
      top: 100,
      left: 200,
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.renderAll();
  };

  const clearCanvas = () => {
    fabricCanvasRef.current.clear();
  };

  const download = () => {
    const url = fabricCanvasRef.current.toDataURL();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anchor: any = document.createElement("a");
    anchor.href = url;
    anchor.download = true;

    anchor.click();
  };

  const uploadBackground = ({target}) => {
    const file = target.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      fabricCanvasRef.current.setBackgroundImage(
        reader.result,
        fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current)
      );
    };
    reader.readAsDataURL(file);   
  };
  useEffect(() => {
    fabricCanvasRef.current.on('mouse:down', function(opt) {
      const evt = opt.e;
      if (evt.altKey === true) {
        fabricCanvasRef.current.isDragging = true;
        fabricCanvasRef.current.selection = false;
        fabricCanvasRef.current.lastPosX = evt.clientX;
        fabricCanvasRef.current.lastPosY = evt.clientY;
      }
    });

    fabricCanvasRef.current.on('mouse:move', function(opt) {
      if (fabricCanvasRef.current.isDragging) {
        const e = opt.e;
        const vpt = fabricCanvasRef.current.viewportTransform;
        vpt[4] += e.clientX - fabricCanvasRef.current.lastPosX;
        vpt[5] += e.clientY - fabricCanvasRef.current.lastPosY;
        fabricCanvasRef.current.requestRenderAll();
        fabricCanvasRef.current.lastPosX = e.clientX;
        fabricCanvasRef.current.lastPosY = e.clientY;
      }
    });

    fabricCanvasRef.current.on('mouse:up', function() {
      fabricCanvasRef.current.setViewportTransform(fabricCanvasRef.current.viewportTransform);
      fabricCanvasRef.current.isDragging = false;
      fabricCanvasRef.current.selection = true;
    });

    fabricCanvasRef.current.on('mouse:wheel', function(opt) {
      const delta = opt.e.deltaY;
      let zoom = fabricCanvasRef.current.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      fabricCanvasRef.current.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  })

  return (
    <div className="global">
      <span className="toolbar">
        <button onClick={addText}>
          Texto <FontColorsOutlined />
        </button>
        <button>
          <label>
            <span className="input">
              <input
                onChange={uploadBackground}
                type="file"
                accept="image/*"
              />
            </span>
            Upload <UploadOutlined />
          </label>
        </button>
        <button>
          Salvar <SaveOutlined />
        </button>
        <button onClick={download}>
          Download <DownloadOutlined />
        </button>
        <button onClick={clearCanvas}>
          Limpar <ClearOutlined />
        </button>
      </span>
      <canvas ref={canvasRef} className="canvas"></canvas>
      <p>Pressione a tecla alt e arraste a tela com o mouse</p>
      <p>O zoom pode ser usado com o scroll do mouse</p>
    </div>
  );
}

export default Canvas;
