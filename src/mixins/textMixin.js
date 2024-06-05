export default {
  data() {
    return {
      stickerText: '',
      textFont: 'Roboto',
      textColor: 'black',
      textAlign: 'left',
      textPosition: {
        top: 50,
        left: 50
      },
      textRotation: 0,
      textSize: 16, // Tamaño inicial del texto
      isResizing: false,
      resizeStart: {
        x: 0,
        y: 0
      },
      textControlPosition: {
        x: 50,
        y: 50

      },
    showControls: false,
      controlOffsets: {
        rotate: { x: -15, y: 15 }, // 35 es un ejemplo, ajusta según el tamaño del texto
        resize: { x: 90, y: 15 },
        verticalAlign: { x: 55, y: 15 },
        horizontalAlign: { x: 20, y: 15 }
        },
      controlPositions: {
        rotate: {
          x: 0,
          y: 0
        },
        resize: {
          x: 0,
          y: 0
        },
        verticalAlign: {
          x: 0,
          y: 0
        },
        horizontalAlign: {
          x: 0,
          y: 0
        }
      },
      borderRect: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
  


      isDragging: false,
      dragStart: {
        x: 0,
        y: 0
      }
    };
  },
  mounted() {
    this.centerText();
  },
  beforeDestroy() {
  document.removeEventListener('click', this.handleDocumentClick);
},
  methods: {
    onTextClick() {
        this.showControls = true;
        this.updateControlPositions(); // Asegúrate de que los controles se posicionen correctamente
      },
      handleDocumentClick(event) {
        if (!this.$el.contains(event.target)) {
          this.showControls = false;
        }
      },
      centerText() {
        const canvasWidth = 600; // Sustituye esto por el ancho real de tu canvas
        const canvasHeight = 600; // Sustituye esto por la altura real de tu canvas
        const textWidth = this.calculateTextWidth();
        const textHeight = this.textSize; // Aproximación basada en el tamaño de la fuente
    
        this.textPosition.left = (canvasWidth / 2) - (textWidth / 2);
        this.textPosition.top = (canvasHeight / 2) - (textHeight / 2);
    
        this.updateControlPositions(); // Actualiza la posición de los controles si es necesario
      },
    
    updateTextFont(newFont) {
      this.textFont = newFont;
    },
    updateTextAlign(newAlign) {
      this.textAlign = newAlign;
    },
    updateStickerText(newText) {
      console.log(newText)
      this.stickerText = newText;
      this.updateControlPositions()

    },
    updateTextColor(newColor) {
      this.textColor = newColor;
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
    calculateTextWidth() {
      // Esta es una simplificación; podrías necesitar un cálculo más preciso
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `${this.textSize}px ${this.textFont}`;
      return context.measureText(this.stickerText).width;
      },
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
    startTextRotate(event) {
      if (this.textRotation != 360) {
        this.textRotation += 90
      } else {
        this.textRotation = 0
      }
      this.updateControlPositions(); // Actualiza la posición de los controles
      this.updateBorder()

    },
    centerTextVertically() {
      // Asumiendo que tienes una forma de obtener la altura del canvas
      const canvasHeight = 600; // Sustituye esto por la altura real de tu canvas
      this.textPosition.top = (canvasHeight / 2) - (this.textSize / 2);
      this.updateTextResizeControl();
      this.updateControlPositions()
    },
    centerTextHorizontally() {
      // Asumiendo que tienes una forma de obtener el ancho del canvas
      const canvasWidth = 600; // Sustituye esto por el ancho real de tu canvas
      const textWidth = this.calculateTextWidth();
      this.textPosition.left = (canvasWidth / 2) - (textWidth / 2);
      this.updateTextResizeControl();
      this.updateControlPositions()
    },

    updateTextResizeControl() {
        const textWidth = this.calculateTextWidth();
        this.textControlPosition.x = this.textPosition.left + textWidth;
        this.textControlPosition.y = this.textPosition.top + this.textSize;
        this.updateControlPositions(); // Actualiza todas las posiciones de los controles
        },

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
  
        // Actualiza el control de redimensionamiento y las posiciones de otros controles
        this.updateTextResizeControl();
        this.updateControlPositions()
    
      }
    },
    updateBorder() {
        this.$nextTick(() => {
          const textElement = this.$refs.textElement;
          if (textElement) {
            const bbox = textElement.getBBox();
            const centerX = bbox.x + bbox.width / 2;
            const centerY = bbox.y + bbox.height / 2;
    
            this.borderRect = {
              x: bbox.x - 5,
              y: bbox.y - 5,
              width: bbox.width + 10,
              height: bbox.height + 10,
              rotation: this.textRotation,
              centerX: centerX,
              centerY: centerY
            };
          }
        });
      },
            stopTextResize() {
      this.isResizing = false;
      document.removeEventListener('mousemove', this.onTextResize);
      document.removeEventListener('mouseup', this.stopTextResize);
      this.updateControlPositions()
    },
    calculateTextDimensions() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = `${this.textSize}px ${this.textFont}`;
        const metrics = context.measureText(this.stickerText);
        return {
          width: metrics.width,
          height: this.textSize // Aproximación basada en el tamaño de la fuente
        };
      },
    
      updateTextMetrics() {
        this.$nextTick(() => {
          const textElement = this.$refs.textElement;
          if (textElement) {
            const bbox = textElement.getBBox();
            this.borderRect = {
              x: bbox.x - 5, // Ajuste para el padding
              y: bbox.y - 5,
              width: bbox.width + 10,
              height: bbox.height + 10
            };
          }
        });
      }    

  },
  watch: {
    stickerText() {
        this.updateTextMetrics();
      },
      textSize() {
        this.updateTextMetrics();
      },
      textFont() {
        this.updateTextMetrics();
      }
      }
};
