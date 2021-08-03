import { fabric } from "fabric";

async function convertJSONToPNG(json: any) {

    let canvas = new fabric.Canvas(null, { width: 1920, height: 1080 });

    let loadFromJSON = (json: any) => new Promise((resolve, reject) => {
        canvas.loadFromJSON(json, resolve);
    });

    await loadFromJSON(json);

    let png = canvas.toDataURL();

    return png;
}

export default convertJSONToPNG;