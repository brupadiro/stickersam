export default {
    data() {
      return {
        textPosition: {
          top: 50,
          left: 50
        },
        textControlPosition: {
          x: 50,
          y: 50
        },
        controlPositions: {
          rotate: { x: 0, y: 0 },
          resize: { x: 0, y: 0 },
          verticalAlign: { x: 0, y: 0 },
          horizontalAlign: { x: 0, y: 0 }
        },
      };
    },
    methods: {
      updateControlPositions() {
        const angleInRadians = this.textRotation * (Math.PI / 180);
        const sinTheta = Math.sin(angleInRadians);
        const cosTheta = Math.cos(angleInRadians);
        Object.keys(this.controlOffsets).forEach(key => {
          const offset = this.controlOffsets[key];
          this.controlPositions[key].x = this.textPosition.left + (offset.x * cosTheta - offset.y * sinTheta);
          this.controlPositions[key].y = this.textPosition.top + (offset.x * sinTheta + offset.y * cosTheta);
        });
      },
      centerTextVertically() {
        const canvasHeight = 600; // Ajusta según tu contexto
        this.textPosition.top = (canvasHeight / 2) - (this.textSize / 2);
        this.updateControlPositions();
      },
      centerTextHorizontally() {
        const canvasWidth = 600; // Ajusta según tu contexto
        const textWidth = this.calculateTextWidth();
        this.textPosition.left = (canvasWidth / 2) - (textWidth / 2);
        this.updateControlPositions();
      },
      updateTextResizeControl() {
        const textWidth = this.calculateTextWidth();
        this.textControlPosition.x = this.textPosition.left + textWidth;
        this.textControlPosition.y = this.textPosition.top + this.textSize;
        this.updateControlPositions();
      },
      startTextDrag(event) {
        this.isDragging = true;
        this.dragStart.x = event.clientX - this.textPosition.left;
        this.dragStart.y = event.clientY - this.textPosition.top;
        document.addEventListener('mousemove', this.onTextDrag);
        document.addEventListener('mouseup', this.stopTextDrag);
      },
      onTextDrag(event) {
        if (this.isDragging) {
  
          this.textPosition.left = event.clientX - this.dragStart.x;
          this.textPosition.top = event.clientY - this.dragStart.y;
          this.updateControlPositions(); // Actualiza las posiciones de los controles
          this.updateBorder();
      }
      },
      stopTextDrag() {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.onTextDrag);
        document.removeEventListener('mouseup', this.stopTextDrag);
      },
  

    }
  };