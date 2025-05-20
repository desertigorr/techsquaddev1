import { colorArray } from "../components/ColorPalette";

export type RectShape = {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
  className: string;
};


export const fetchDefects = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL
    console.log('defects.ts fetchDefects apiUrl:', apiUrl)
    const response = await fetch(`${apiUrl}/defects`);
    const data = await response.json();
    const boxes = data.user.defects.instances.pred_boxes;
    const classes = data.user.defects.instances.pred_classes;

    return boxes.map((box: number[], i: number) => ({
      x: box[0],
      y: box[1],
      width: box[2] - box[0],
      height: box[3] - box[1],
      stroke: colorArray[classes[i]],
      className: classes[i]
    }));
  } catch {
    console.log("Ошибка при загрузке данных!");
  };
};

export const replaceImage = async (file: File, userId: number, filename: string, rects: RectShape[]) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL
    console.log('defects.ts replaceImage apiUrl:', apiUrl)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId.toString());
    formData.append("filename", filename);

    const transformedRects = rects.map((rect) => ({
      x1: rect.x,
      y1: rect.y,
      x2: rect.x + rect.width,
      y2: rect.y + rect.height,
      className: rect.className,
    }));

    formData.append("rects", JSON.stringify(transformedRects));

    const response = await fetch(`${apiUrl}/replace-image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Ошибка замены файла");
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err)
  }
};

