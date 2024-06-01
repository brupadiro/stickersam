<template>
  <section>
    <v-navigation-drawer color="black" rail-width="80" permanent dark rail absolute location="right">
      <v-list nav class="pa-0">
        <navigationIconComponent icon="upload" @click="tab='upload'" :selected="tab=='upload'">
          Upload file
        </navigationIconComponent>
        <v-divider></v-divider>
        <navigationIconComponent icon="letter" @click="tab='write'" :selected="tab=='write'">
          Insert Text
        </navigationIconComponent>
        <v-divider></v-divider>
        <navigationIconComponent icon="cutter" @click="tab='cutline'" :selected="tab=='cutline'">
          Cutline
        </navigationIconComponent>
        <v-divider></v-divider>
        <navigationIconComponent icon="paint-roller" @click="tab='background'" :selected="tab=='background'">
          Background
        </navigationIconComponent>
        <v-divider></v-divider>
      </v-list>
    </v-navigation-drawer>

    <v-row no-gutters>
      <v-col cols="12" md="9">
        <div class="editor-container">
          <div v-if="imageUrl" class="canvas">
            <svg :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`" preserveAspectRatio="xMidYMid meet" class="editable-area">
              <defs>
                <clipPath id="clip-shape">
                  <path :d="shapePath" stroke-width="10"></path>
                  <path :d="whiteContourPath" stroke="white" stroke-width="10"></path>
                </clipPath>
              </defs>
              <rect width="100%" height="100%" fill="#808080b8" />
              <g :clip-path="'url(#clip-shape)'">
                <rect width="100%" height="100%" fill="white" />
                <image
                  ref="image"
                  :xlink:href="imageUrl"
                  :width="imageWidth"
                  :height="imageHeight"
                  :x="imagePosition.x"
                  :y="imagePosition.y"
                  @mousedown="startImageDrag"
                />
              </g>
              <text :x="textPosition.left" :y="textPosition.top" :fill="textColor" :font-family="textFont" @mousedown="startTextDrag">
                {{ stickerText }}
              </text>
              <rect
                :x="imagePosition.x + imageWidth - 10"
                :y="imagePosition.y + imageHeight - 10"
                width="10"
                height="10"
                fill="red"
                cursor="se-resize"
                @mousedown="startImageResize"
              />
              <rect width="100%" height="100%" fill="none" stroke="white" stroke-dasharray="5,5" />
              <rect
                :x="canvasWidth - 10"
                :y="canvasHeight - 10"
                width="10"
                height="10"
                fill="blue"
                cursor="se-resize"
                @mousedown="startCanvasResize"
              />
            </svg>          </div>
        </div>
      </v-col>
      <v-col cols="12" md="3">
        <v-card flat color="white">
          <v-card-title>
            Die Cut Sticker
          </v-card-title>
          <v-card-text>
            <v-card flat tile>
              <v-card-text v-if="tab=='upload'" class="d-flex align-center flex-column">
                <img src="/icons/upload-dark.png" width="40">
                <p>PDF, PNG, JPG, SVG</p>
                <v-btn rounded flat color="yellow" @click="triggerFileInput">
                  browse files
                </v-btn>
                <input type="file" ref="fileInput" style="display: none" @change="onFileChange" />
              </v-card-text>
              <v-card-text v-else-if="tab=='cutline'">
                <v-row>
                  <v-col cols="4" v-for="shape in shapeItems" :key="shape.value">
                    <v-card flat @click="selectedShape = shape.value">
                      <img :src="`/icons/${shape.value}.svg`" class="ma-1"
                        :class="(selectedShape ==shape.value)?'selected_shape':''">
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-text v-else-if="tab=='write'" class="pa-0">
                <v-card flat>
                  <v-row no-gutters>
                    <v-col cols="12" class="px-2 py-2 d-flex justify-center align-center">
                      <input v-model="stickerText" placeholder="Enter text"
                        style="height:30px;border:1px solid black; width:100%">
                    </v-col>
                    <v-divider style="background:black;"></v-divider>
                    <v-col cols="12" class="px-2">
                      <v-label class="full-width text-overline font-weight-light black--text">Font</v-label>
                      <div style="position: relative;">
                        <select v-model="textFont"
                          style="appearance: none; -webkit-appearance: none; -moz-appearance: none;">
                          <option class="font-weight-light" v-for="font in availableFonts" :key="font" :value="font">
                            {{ font }}</option>
                        </select>
                        <span
                          style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none;">&#9660;</span>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <v-color-picker v-model="textColor" flat hide-inputs elevation="0" position="relative"
                        width="100%"></v-color-picker>
                    </v-col>
                  </v-row>
                </v-card>
              </v-card-text>
              <v-card-text v-else-if="tab=='background'">
                <v-card outlined flat>
                  <v-color-picker v-model="backgroundColor" flat hide-inputs elevation="0" position="relative"
                    width="100%"></v-color-picker>
                </v-card>
              </v-card-text>
            </v-card>
          </v-card-text>
          <v-card-text>
            <v-card tile flat>
              <v-card-text>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-label class="font-weight-bold text-overline black--text">Laminate</v-label>
                    <v-menu offset-y location="top">
                      <template v-slot:activator="{ props }">
                        <div v-bind="props" class="v-text-field"
                          style="display: flex; align-items: center; cursor: pointer;">
                          <span>{{ selectedLaminate || 'Selecciona una opción' }}</span>
                          <v-icon right>mdi-menu-down</v-icon>
                        </div>
                      </template>
                      <v-list>
                        <v-list-item v-for="(option, index) in laminateOptions" :key="index"
                          @click="selectOption(option)">
                          <v-list-item-title>{{ option.title }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                  <v-col cols="12">
                    <v-divider></v-divider>
                  </v-col>
                  <v-col cols="4">
                    <v-label class="font-weight-bold text-overline black--text">Width</v-label>
                    <input type="number" v-model="width">
                  </v-col>
                  <v-col cols="4">
                    <v-label class="font-weight-bold text-overline black--text">Height</v-label>
                    <input type="number" v-model="height">
                  </v-col>
                  <v-col cols="4">
                    <v-label class="font-weight-bold text-overline black--text">Quantity</v-label>
                    <input type="number" v-model="quantity">
                  </v-col>
                  <v-col cols="12">
                    <v-divider></v-divider>
                  </v-col>
                  <v-col cols="12">
                    <v-label class="font-weight-bold text-overline black--text">Comment</v-label>
                    <div class="d-flex justify-space-between">
                      <input type="text" v-model="comment" style="width:90%">
                      <v-icon right>mdi-comment</v-icon>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="text-h6 font-weight-bold">
                Total Amount <v-spacer></v-spacer> $39
              </v-card-actions>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script>
  import navigationIconComponent from '@/components/navigationIconComponent.vue';
  import EdgeDetection from '@/libs/edgedetection.js';
  export default {
    mixins:[EdgeDetection],
    components: {
      navigationIconComponent
    },
    data() {
      return {
        tab: 'upload',
        laminateOptions: [{
            title: 'Glossy',
            value: 'glossy'
          },
          {
            title: 'Matte',
            value: 'matte'
          },
          {
            title: 'Satin',
            value: 'satin'
          },
          {
            title: 'Textured',
            value: 'textured'
          }
        ],
        width: 10,
        height: 10,
        quantity: 1,
        canvasWidth: 600,
        canvasHeight: 600,
        imageWidth: 600,
        imageHeight: 600,
        imagePosition: {
          x: 0,
          y: 0
        },

        comment: '',
        selectedLaminate: null,
        productItems: [{
            title: 'Kiss Cut Sheet',
            value: 'sheet_kiss_cut'
          },
          {
            title: 'Hang Tag Sticker',
            value: 'hang_tag'
          },
          {
            title: 'Epoxy 3D Sticker',
            value: '3d_dome'
          },
          {
            title: 'Front Adhesive Sticker',
            value: 'front_adhesive'
          },
          {
            title: 'Heavy Duty Sticker',
            value: 'heavy_duty'
          },
          {
            title: 'Removable Sticker',
            value: 'removable'
          },
          {
            title: 'Wall Sticker',
            value: 'wall'
          },
          {
            title: 'Floor Sticker',
            value: 'floor'
          }
        ],
        shapeItems: [{
            title: 'Square',
            value: 'square'
          },{
            title: 'Contour cut',
            value: 'contour_cut'
          },
          {
            title: 'Circle',
            value: 'circle'
          },
          {
            title: 'Rounded corners',
            value: 'rounded_corners'
          },
        ],
        selectedShape: 'square',
        backgroundColor: '#ffffff',
        stickerText: '',
        imageUrl: null,
        textPosition: {
          top: 50,
          left: 50
        },
        isDragging: false,
        dragStart: {
          x: 0,
          y: 0
        },
        textFont: 'Arial',
        textColor: '#ffffff',
        availableFonts: ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia'],
        isResizing: false,
        resizeStart: {
          width: 0,
          height: 0,
          x: 0,
          y: 0
        },
        contourPath:'',
        isCanvasResizing: false,
        whiteContourPath:'',
        canvasResizeStart: {
          width: 0,
          height: 0,
          x: 0,
          y: 0
        }

      };
    },
    mounted() {
      if(this.$vuetify.display.xsAndDown){
        console.log("aca")
        this.canvasWidth = 300;
      this.canvasHeight = 300;
      this.imageWidth = 300;
      this.imageHeight = 300;

      }
      
    },
    methods: {
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      onFileChange(e) {
        const file = e.target.files[0];
        if (file) {
          this.imageUrl = URL.createObjectURL(file);
        }
      },
      updateCanvasSize() {
      const containerWidth = this.$refs.editorContainer.offsetWidth;
      const containerHeight = this.$refs.editorContainer.offsetHeight;
      const size = Math.min(containerWidth, containerHeight);
      this.canvasWidth = size;
      this.canvasHeight = size;
      this.imageWidth = size;
      this.imageHeight = size;
    },

      startDrag(event) {
        this.isDragging = true;
        this.dragStart.x = event.clientX - this.textPosition.left;
        this.dragStart.y = event.clientY - this.textPosition.top;
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);
      },
      onDrag(event) {
        if (this.isDragging) {
          this.textPosition.left = event.clientX - this.dragStart.x;
          this.textPosition.top = event.clientY - this.dragStart.y;
        }
      },
      stopDrag() {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);
      },
      startResize(event) {
        this.isResizing = true;
        const image = this.$refs.image;
        this.resizeStart.width = image.offsetWidth;
        this.resizeStart.height = image.offsetHeight;
        this.resizeStart.x = event.clientX;
        this.resizeStart.y = event.clientY;
        document.addEventListener('mousemove', this.onResize);
        document.addEventListener('mouseup', this.stopResize);
      },
      onResize(event) {
        if (this.isResizing) {
          const image = this.$refs.image;
          const width = this.resizeStart.width + (event.clientX - this.resizeStart.x);
          const height = this.resizeStart.height + (event.clientY - this.resizeStart.y);
          image.style.width = `${width}px`;
          image.style.height = `${height}px`;
        }
      },
  // ... otros métodos
  // ... otros métodos
     stopResize() {
        this.isResizing = false;
        document.removeEventListener('mousemove', this.onResize);
        document.removeEventListener('mouseup', this.stopResize);
      },
      startImageDrag(event) {
        this.isDragging = true;
        this.dragStart.x = event.clientX - this.imagePosition.x;
        this.dragStart.y = event.clientY - this.imagePosition.y;
        document.addEventListener('mousemove', this.onImageDrag);
        document.addEventListener('mouseup', this.stopImageDrag);
      },
      onImageDrag(event) {
        if (this.isDragging) {
          this.imagePosition.x = event.clientX - this.dragStart.x;
          this.imagePosition.y = event.clientY - this.dragStart.y;
        }
      },
      stopImageDrag() {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.onImageDrag);
        document.removeEventListener('mouseup', this.stopImageDrag);
      },
      startImageResize(event) {
        this.isResizing = true;
        this.resizeStart.width = this.imageWidth;
        this.resizeStart.height = this.imageHeight;
        this.resizeStart.x = event.clientX;
        this.resizeStart.y = event.clientY;
    document.addEventListener('mousemove', this.onImageResize);
    document.addEventListener('mouseup', this.stopImageResize);
  },
  onImageResize(event) {
    if (this.isResizing) {
      const newWidth = this.resizeStart.width + (event.clientX - this.resizeStart.x);
      const newHeight = this.resizeStart.height + (event.clientY - this.resizeStart.y);
      this.imageWidth = Math.max(10, newWidth); // Asegúrate de que la imagen no sea demasiado pequeña
      this.imageHeight = Math.max(10, newHeight);
    }
  },
  stopImageResize() {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onImageResize);
    document.removeEventListener('mouseup', this.stopImageResize);
  },
  startCanvasResize(event) {
        this.isCanvasResizing = true;
        this.canvasResizeStart.width = this.canvasWidth;
        this.canvasResizeStart.height = this.canvasHeight;
        this.canvasResizeStart.x = event.clientX;
        this.canvasResizeStart.y = event.clientY;
        document.addEventListener('mousemove', this.onCanvasResize);
        document.addEventListener('mouseup', this.stopCanvasResize);
      },
      onCanvasResize(event) {
        if (this.isCanvasResizing) {
          const newWidth = this.canvasResizeStart.width + (event.clientX - this.canvasResizeStart.x);
          const newHeight = this.canvasResizeStart.height + (event.clientY - this.canvasResizeStart.y);
          this.canvasWidth = Math.max(100, newWidth); // Asegúrate de que el lienzo no sea demasiado pequeño
          this.canvasHeight = Math.max(100, newHeight);
        }
      },
      stopCanvasResize() {
        this.isCanvasResizing = false;
        document.removeEventListener('mousemove', this.onCanvasResize);
        document.removeEventListener('mouseup', this.stopCanvasResize);
      },

      centerHorizontally() {
        const resizable = this.$refs.resizable;
        const container = this.$el.querySelector('.image-container');
        const left = (container.offsetWidth - resizable.offsetWidth) / 2;
        resizable.style.left = `${left}px`;
      },
      centerVertically() {
        const resizable = this.$refs.resizable;
        const container = this.$el.querySelector('.image-container');
        const top = (container.offsetHeight - resizable.offsetHeight) / 2;
        resizable.style.top = `${top}px`;
      },
    },
    watch: {
  selectedShape(newShape) {
    if (newShape === 'contour_cut') {
      this.detectContour();
    }
  }
},

    computed: {
      shapePath() {
        switch (this.selectedShape) {
          case 'square':
            return `M0,0 L${this.canvasWidth},0 L${this.canvasWidth},${this.canvasHeight} L0,${this.canvasHeight} Z`;
          case 'circle':
            const radius = Math.min(this.canvasWidth, this.canvasHeight) / 2;
            const cx = this.canvasWidth / 2;
            const cy = this.canvasHeight / 2;
            return `M${cx},${cy - radius} A${radius},${radius} 0 1,0 ${cx},${cy + radius} A${radius},${radius} 0 1,0 ${cx},${cy - radius}`;
          case 'rounded_corners':
            const cornerRadius = 50;
            return `M0,${cornerRadius} Q0,0 ${cornerRadius},0 L${this.canvasWidth - cornerRadius},0 Q${this.canvasWidth},0 ${this.canvasWidth},${cornerRadius} L${this.canvasWidth},${this.canvasHeight - cornerRadius} Q${this.canvasWidth},${this.canvasHeight} ${this.canvasWidth - cornerRadius},${this.canvasHeight} L${cornerRadius},${this.canvasHeight} Q0,${this.canvasHeight} 0,${this.canvasHeight - cornerRadius} Z`;
            case 'contour_cut':
              return this.contourPath;
          default:
            return `M0,0 L${this.canvasWidth},0 L${this.canvasWidth},${this.canvasHeight} L0,${this.canvasHeight} Z`;
        }
      }
    },
  };

</script>
<style>
  .v-application {
    background: #f5f5f5 !important;
  }

  .canvas {
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #808080b8;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .editable-area {
    background-color: white;
  }
  .dashed-border {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px dashed white;
    box-sizing: border-box;
    z-index: 1;
  }

  .text-overlay {
    position: absolute;
    z-index: 2;
  }

  .resizable {
    position: relative;
    display: inline-block;
  }

  .image-wrapper {
    position: relative;
    display: inline-block;
    cursor: move;
    height: 300px;
    width: 300px;
    z-index: 0;
  }

  .resize-handle {
    width: 10px;
    height: 10px;
    background: red;
    position: absolute;
    bottom: 0;
    right: 0;
    cursor: se-resize;
    z-index: 2;
  }

  .square .dashed-border {
    clip-path: inset(0%);
  }

  .circle .dashed-border {
    clip-path: circle(50%);
  }

  .rounded_corners .dashed-border {
    clip-path: inset(0% round 15%);
  }

  .contour_cut .dashed-border {
    /* Aquí puedes agregar estilos específicos para el contorno */
  }

  .clipped-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .selected_shape {
    border: 1px solid red;
  }
.editor-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: auto;
}

.canvas {
  border: 1px solid black;
  width: 100%;
  height: auto;
  max-width: 100%;
}

.editable-area {
  max-width: 100%;
  height: auto;
}

.selected_shape {
  border: 2px solid #FFBF00;
}
</style>