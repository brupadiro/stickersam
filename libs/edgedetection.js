class EdgeDetection {
  static cannyEdgeDetector(imageData, width, height) {
    const gray = [];
    for (let i = 0; i < imageData.length; i += 4) {
      const avg = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
      gray.push(avg, avg, avg, imageData[i + 3]);
    }

    const edges = new Uint8ClampedArray(width * height);
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    const gradientX = new Float32Array(width * height);
    const gradientY = new Float32Array(width * height);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0;
        let gy = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixel = gray[((y + ky) * width + (x + kx)) * 4];
            gx += pixel * sobelX[(ky + 1) * 3 + (kx + 1)];
            gy += pixel * sobelY[(ky + 1) * 3 + (kx + 1)];
          }
        }
        gradientX[y * width + x] = gx;
        gradientY[y * width + x] = gy;
      }
    }

    for (let i = 0; i < width * height; i++) {
      edges[i] = Math.sqrt(gradientX[i] ** 2 + gradientY[i] ** 2);
    }

    const threshold = 100;
    for (let i = 0; i < edges.length; i++) {
      edges[i] = edges[i] > threshold ? 255 : 0;
    }

    return edges;
  }

  static findContours(edges, width, height) {
    const contours = [];
    const visited = new Uint8Array(width * height);
    const directions = [
      { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 },
      { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }
    ];

    function traceContour(x, y) {
      const contour = [];
      let startX = x, startY = y;
      do {
        contour.push({ x, y });
        visited[y * width + x] = 1;
        for (const dir of directions) {
          const newX = x + dir.x;
          const newY = y + dir.y;
          if (newX >= 0 && newX < width && newY >= 0 && newY < height && edges[newY * width + newX] === 255 && !visited[newY * width + newX]) {
            x = newX;
            y = newY;
            break;
          }
        }
      } while (x !== startX || y !== startY);
      return contour;
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (edges[y * width + x] === 255 && !visited[y * width + x]) {
          contours.push(traceContour(x, y));
        }
      }
    }
  
    return contours;
    }
  }
  
  export default EdgeDetection;