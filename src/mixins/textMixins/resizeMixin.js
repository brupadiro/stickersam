export default {
    data() {
      return {
        textSize: 16,
        isResizing: false,
        resizeStart: {
          x: 0,
          y: 0
        },
        textControlPosition: {
          x: 50,
          y: 50
        },
      };
    },
    methods: {
      startTextResize(event) {
        this.isResizing = true;
        this.resizeStart.x = event.clientX;
        this.resizeStart.y = event.clientY;
        document.addEventListener('mousemove', this.onTextResize);
        document.addEventListener('mouseup', this.stopTextResize);
      },
      onTextResize(event) {
        if (this.isResizing) {
          const dx = event.clientX - this.resizeStart.x;
          this.textSize += dx * 0.1; // Ajusta este factor según la sensibilidad deseada
          this.resizeStart.x = event.clientX;
          this.updateTextResizeControl();
          this.updateControlPositions(); // Asegúrate de que esta función se maneje adecuadamente si es parte del redimensionamiento
        }
      },
      stopTextResize() {
        this.isResizing = false;
        document.removeEventListener('mousemove', this.onTextResize);
        document.removeEventListener('mouseup', this.stopTextResize);
        this.updateControlPositions(); // Asegúrate de que esta función se maneje adecuadamente si es parte del redimensionamiento
      },
      updateTextResizeControl() {
        const textWidth = this.calculateTextWidth(); // Asegúrate de que esta función se maneje adecuadamente si es parte del redimensionamiento
        this.textControlPosition.x = this.textPosition.left + textWidth;
        this.textControlPosition.y = this.textPosition.top + this.textSize;
        this.updateControlPositions(); // Asegúrate de que esta función se maneje adecuadamente si es parte del redimensionamiento
      }
    }
  };