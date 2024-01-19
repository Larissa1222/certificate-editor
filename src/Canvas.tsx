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
        fabricCanvasRef.current.renderAll.bind(fabricCanvasRef)
      );
    };
    reader.readAsDataURL(file);   
  };

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
    </div>
  );
}

export default Canvas;
