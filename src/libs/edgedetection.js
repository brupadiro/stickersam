export default {
  methods: {
  detectContour() {
    const cv = this.$cv;
    const image = this.$refs.image;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = this.imageUrl;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Convert imageData to Mat
      const src = cv.matFromImageData(imageData);
      const gray = new cv.Mat();
      const thresholded = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(gray, thresholded, 128, 255, cv.THRESH_BINARY);

      // Find contours
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(thresholded, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

      // Find the largest contour
      let largestContour = null;
      let maxArea = 0;
      let largestContourIndex = -1;
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);
        if (area > maxArea) {
          maxArea = area;
          largestContour = contour;
          largestContourIndex = i;
        }
      }

      // Create path string from the largest contour
      let pathString = '';
      if (largestContour) {
        const scaleX = this.imageWidth / canvas.width;
        const scaleY = this.imageHeight / canvas.height;
        pathString += 'M' + (largestContour.data32S[0] * scaleX) + ',' + (largestContour.data32S[1] * scaleY);
        for (let j = 2; j < largestContour.data32S.length; j += 2) {
          pathString += 'L' + (largestContour.data32S[j] * scaleX) + ',' + (largestContour.data32S[j + 1] * scaleY);
        }
        pathString += 'Z';
      }

      // Create a mask for the inverse contour
      const mask = new cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC1);

      // Draw the largest contour on the mask
      if (largestContourIndex !== -1) {
        cv.drawContours(mask, contours, largestContourIndex, new cv.Scalar(255, 255, 255, 255), cv.FILLED);
      }

      // Invert the mask
      cv.bitwise_not(mask, mask);

      // Create a white image
      const whiteImage = new cv.Mat(src.rows, src.cols, src.type(), new cv.Scalar(255, 255, 255, 255));

      // Apply the inverse mask to the white image
      const result = new cv.Mat();
      whiteImage.copyTo(result, mask);

      // Combine the result with the original image
      cv.addWeighted(src, 1, result, 1, 0, src);

      // Calculate the offset
      const offsetX = (this.canvasWidth - this.imageWidth) / 2;
      const offsetY = (this.canvasHeight - this.imageHeight) / 2;

      // Apply the offset to the inversePathString
      let inversePathString = `M${offsetX},${offsetY} L${offsetX + this.imageWidth},${offsetY} L${offsetX + this.imageWidth},${offsetY + this.imageHeight} L${offsetX},${offsetY + this.imageHeight} Z ${pathString}`;

      // Update shapePath
      this.contourPath = inversePathString;

      // Display the result on the canvas
      cv.imshow(canvas, src);

      // Clean up
      src.delete();
      gray.delete();
      thresholded.delete();
      contours.delete();
      hierarchy.delete();
      mask.delete();
      whiteImage.delete();
      result.delete();
    };
  },
  // ... otros métodos
}
}