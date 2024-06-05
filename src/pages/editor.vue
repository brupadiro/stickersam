<template>
  <section class="fill-height">
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
        <navigationIconComponent icon="material" @click="tab='material'" :selected="tab=='material'">
          Material
        </navigationIconComponent>
        <v-divider></v-divider>
      </v-list>
    </v-navigation-drawer>

    <v-row no-gutters class="fill-height">
      <v-col cols="12" md="9" class="d-flex justify-center mt-12">
        <div class="editor-container">
          <div class="canvas svg-container">
            <div class="dimensions width-dimension">{{ pixelsToCentimeters(canvasWidth).toFixed(2) + ' cm' }}</div>
  <div class="dimensions height-dimension">{{ pixelsToCentimeters(canvasHeight).toFixed(2) + ' cm' }}</div>
<div class="shape-container" :class="selectedShape"> 
            <svg  :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`" preserveAspectRatio="xMidYMid meet"
              class="editable-area">
              <defs>
                <pattern v-if="selectedPattern" id="backgroundPattern" patternUnits="userSpaceOnUse" width="100" height="100">
          <image :xlink:href="selectedPattern.imageUrl" width="100" height="100" />
        </pattern>

                <clipPath id="clip-shape">
                  <path :d="shapePath" stroke-width="10"></path>
                  <path :d="whiteContourPath" stroke="white" stroke-width="10"></path>
                </clipPath>
              </defs>
              <rect width="100%" height="100%" fill="url(#backgroundPattern)" />
              <g :clip-path="'url(#clip-shape)'" >
                <rect width="100%" height="100%" fill="url(#backgroundPattern)"  />
                <image ref="image" v-if="imageUrl"  :xlink:href="imageUrl" :width="imageWidth" :height="imageHeight" :x="imagePosition.x"
                  :y="imagePosition.y" @mousedown="startImageDrag" />
              </g>
              <g v-if="stickerText">
          <text ref="textElement" @click="showControls =true" mousedown="startTextDrag" :x="textPosition.left" :y="textPosition.top" :fill="textColor" :font-family="textFont" :font-size="textSize"
                :transform="'rotate(' + textRotation + ',' + (textPosition.left + borderRect.width / 2) + ',' + (textPosition.top + borderRect.height / 2) + ')'">
            {{ stickerText }}
          </text>
                <image v-if="showControls" :x="controlPositions.rotate.x" :y="controlPositions.rotate.y" width="15" height="15" @click="startTextRotate" xlink:href="/icons/rotate.png" />
                <image v-if="showControls"  :x="controlPositions.resize.x" :y="controlPositions.resize.y" width="15" height="15" @click="startTextResize" xlink:href="/icons/resize.png" />
                <image v-if="showControls"  :x="controlPositions.verticalAlign.x" :y="controlPositions.verticalAlign.y" width="15" height="15" @click="centerTextHorizontally" xlink:href="/icons/vertical.png" />
                <image v-if="showControls"  :x="controlPositions.horizontalAlign.x" :y="controlPositions.horizontalAlign.y" width="15" @click="centerTextVertically" height="15" xlink:href="/icons/horizontal.png" />
              </g>

              <image :x="imagePosition.x + imageWidth - 10" :y="imagePosition.y + imageHeight - 10" width="30"
                height="30" fill="red" cursor="se-resize" @mousedown="startImageResize"  xlink:href="/icons/resize.png" />
              <rect width="100%" height="100%" fill="none" stroke="white" stroke-dasharray="5,5" />
              <rect />
              <image  :x="canvasWidth - 30" :y="canvasHeight - 30" width="30" height="30"  cursor="se-resize"
              @mousedown="startCanvasResize" xlink:href="/icons/resize.png" />
              </svg>
</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="3" class="border-s-sm">
        <v-card flat color="#f7f7f7" class="fill-height">
          <v-card-title class="font-weight-bold">
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
              <v-card-text v-else-if="tab=='material'" class="pa-0">
              <v-list dense>
                  <v-list-item v-for="(pattern, index) in patternList" :key="index" @click="updatePattern(pattern)"  :value="pattern">
                    <template v-slot:prepend>   
                      <v-avatar>
                        <v-img :src="pattern.iconUrl"></v-img>
                      </v-avatar>                   
                    </template>
                    <v-list-item-content>
                      <v-list-item-title>{{ pattern.name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
              </v-list>
              </v-card-text>
              <v-card-text v-else-if="tab=='background'">
                <v-card outlined flat>
                  <v-color-picker v-model="backgroundColor" flat hide-inputs elevation="0" position="relative"
                    width="100%"></v-color-picker>
                </v-card>
              </v-card-text>


              <v-card-text v-else-if="tab=='write'" class="pa-0">
                <textEditorComponent @update:textFont="updateTextFont"
                  @update:textAlign="updateTextAlign" @update:stickerText="updateStickerText"
                  @update:textColor="updateTextColor">
                </textEditorComponent>
              </v-card-text>
            </v-card>
          </v-card-text>
          <v-card-text>
            <v-card tile flat class="border-sm">
                <v-row no-gutters>
                  <v-col cols="12 pa-3">
                    <label class="font-weight-bold  black--text" style="font-size:10px;">Laminate</label>
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
                  <v-col cols="4" class="px-4 py-1">
                    <label class="font-weight-bold  black--text" style="font-size:10px;">Width</label>
                    <input type="number" style="width:100%" v-model="inputWidthCm" @change="updateCanvasSizeInCm(inputWidthCm, inputHeightCm)">
                  </v-col>
                  <v-col cols="4" class="px-4 border-e-sm border-s-sm py-1">
                    <label class="font-weight-bold  black--text" style="font-size:10px;">Height</label>
                    <input type="number" style="width:100%" v-model="inputHeightCm" @change="updateCanvasSizeInCm(inputWidthCm, inputHeightCm)">                  </v-col>
                  <v-col cols="4" class="px-4 py-1">
                    <label class="font-weight-bold  black--text" style="font-size:10px;">Quantity</label>
                    <input type="number" style="width:100%" v-model="quantity">
                  </v-col>
                  <v-col cols="12">
                    <v-divider></v-divider>
                  </v-col>
                  <v-col cols="12 pa-3">
                    <label class="font-weight-bold  black--text" style="font-size:10px;">Comment</label>
                    <div class="d-flex justify-space-between">
                      <v-menu offset-y location="top" v-model="commentsMenu" :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                          <input type="text" v-model="comment" readonly style="width:90%" v-bind="props">
                          <v-icon right>mdi-comment</v-icon>
                        </template>
                        <v-card width=250px>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn small text @click="comment = tempComment; commentsMenu=false">
                            Done
                          </v-btn>

                          </v-card-actions>
                          <v-card-text>
                            Note: We always make sure your order looks tip top before it hits production. Leave a comment here to let us know where you want certain effects or inks on your sticker so we can bring your vision to life. 
                          </v-card-text>
                          <v-card-text>
                          <v-textarea v-model="tempComment" placeholder="Escribe tu comentario aquí..."></v-textarea>
                          </v-card-text>
                        </v-card>
                      </v-menu>
                    </div>
                  </v-col>
                </v-row>
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
  import textEditorComponent from '@/components/editor/textComponent.vue';
  import EdgeDetection from '@/libs/edgedetection.js';
  import textMixin from '@/mixins/textMixin.js';
  export default {
    mixins: [EdgeDetection,textMixin],
    components: {
      navigationIconComponent,
      textEditorComponent
    },
    data() {
      return {
        tab: 'upload',
        tempComment:'',
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
        patternList: [
          { name: 'Holographic', imageUrl: 'https://d6ce0no7ktiq.cloudfront.net/images/web/editor/holographic_bg.png', iconUrl:'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/48e2c5c8c6ab57d013675b3b245daa2136e0c7cf.png' },
          { name: 'Glitter', imageUrl: 'https://d6ce0no7ktiq.cloudfront.net/images/web/editor/glitter_bg.png', iconUrl:'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/8d48777356c014861f8e174949f2a382778c0a7e.png' },
          { name: 'Kraft Papper', imageUrl: 'https://d6ce0no7ktiq.cloudfront.net/images/web/editor/kraft_paper_bg.png', iconUrl:'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/e4ae8c4973e6e530cedcce836d8366638ca4c6d3.png' },
          { name: 'Pixie Dust', imageUrl: 'https://d6ce0no7ktiq.cloudfront.net/images/web/editor/pixie_dust_bg.png', iconUrl:'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/08/23/46dac2bd418951b1412d4225cbdaad579aed03e4.png' },
        ],
        selectedPattern: null, // Inicializa la URL de la imagen del patrón

        commentsMenu:false,
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
        imageUrl: null,
        isResizing: false,
        resizeStart: {
          width: 0,
          height: 0,
          x: 0,
          y: 0
        },
        contourPath: '',
        inputWidthCm:10,
        inputHeightCm:10,
        isCanvasResizing: false,
        whiteContourPath: '',
        canvasResizeStart: {
          width: 0,
          height: 0,
          x: 0,
          y: 0
        }

      };
    },
    mounted() {
      if (this.$vuetify.display.xsAndDown) {
        console.log("aca")
        this.canvasWidth = 300;
        this.canvasHeight = 300;
        this.imageWidth = 300;
        this.imageHeight = 300;

      }

    },
    methods: {
      pixelsToCentimeters(pixels) {
    const pixelsPerInch = 96;
    const centimetersPerInch = 2.54;
    return (pixels / pixelsPerInch) * centimetersPerInch;
  },
  centimetersToPixels(centimeters) {
    const pixelsPerInch = 96;
    const centimetersPerInch = 2.54;
    return (centimeters / centimetersPerInch) * pixelsPerInch;
  },
  updateCanvasSizeInCm(widthCm, heightCm) {
    this.canvasWidth = this.centimetersToPixels(widthCm);
    this.canvasHeight = this.centimetersToPixels(heightCm);
  },

      updatePattern(pattern) {
        this.selectedPattern = pattern;

        console.log('Patrón actualizado:', pattern);
      },

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
    background: #e8e8e8 !important;
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
  .svg-container {
    position: relative;
    display: flex;
    align-items: center; /* Centra verticalmente el SVG y la etiqueta de altura */
  }

  .dimensions {
    position: absolute;
    padding: 2px 5px;
    font-weight:bold;
  }

  .width-dimension {
    top: -50px; /* Ajusta según sea necesario */
    left: 50%;
    transform: translateX(-50%); /* Centra el texto horizontalmente en la parte superior del SVG */
  }

  .height-dimension {
    top: 50%;
    right: -50px; /* Ajusta según sea necesario */
    transform: translateY(-50%); /* Centra el texto verticalmente en el lado derecho del SVG */
    writing-mode: vertical-lr; /* Hace que el texto sea vertical */
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

  .square  {
    clip-path: inset(0%);
  }

  .circle  {
    clip-path: circle(50%);
  }

  .rounded_corners  {
    clip-path: inset(0% round 15%);
  }
.shape-container{
  height:100%;
  width:100%;
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
    width: 90%;
    overflow: auto;
  }

  .canvas {
    width: 100%;
    height: auto;
    max-width: 100%;
    margin: 50px;
    box-shadow: 10px 10px 10px #00000025 !important;

  }

  .editable-area {
    max-width: 100%;
    height: auto;
  }

  .selected_shape {
    border: 2px solid #FFBF00;
  }

  .editor-contaner {
    margin: 15px;
    box-shadow: 10px 10px 10px #00000025 !important;
    max-width: 80%;
  }

</style>
