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
      <v-col md="9">
        <div class="editor-container pa-4">
          <div v-if="imageUrl" class="image-container" :class="selectedShape || 'contour_cut'"
            :style="{ backgroundColor: backgroundColor }">
            <div class="resizable" ref="resizable">
                <div class="image-wrapper" :class="selectedShape || 'contour_cut'" :style="{ backgroundColor: backgroundColor }">
     <img :src="imageUrl" :class="selectedShape || 'contour_cut'" ref="image" />
   </div>              <div class="resize-handle" @mousedown="startResize"></div>
            </div>
            <div class="text-overlay"
              :style="{ top: textPosition.top + 'px', left: textPosition.left + 'px', color: textColor, fontFamily: textFont }"
              @mousedown="startDrag">
              {{ stickerText }}
            </div>

          </div>

        </div>

      </v-col>
      <v-col md="3">
        <v-card flat color="white">
          <v-card-title>
            Die Cut Sticker
          </v-card-title>
          <v-card-text>
            <v-card flat tile>
              <v-card-text v-if="tab=='upload'" class="d-flex align-center flex-column" @click="triggerFileInput">
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
                        <template v-slot:activator="{ props }">                            <div
                              v-bind="props"
                              class="v-text-field"
                              style="display: flex; align-items: center; cursor: pointer;"
                            >
                              <span>{{ selectedLaminate || 'Selecciona una opción' }}</span>
                              <v-icon right>mdi-menu-down</v-icon>
                            </div>
                            </template>
                          <v-list>
                            <v-list-item v-for="(option, index) in laminateOptions" :key="index" @click="selectOption(option)">
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
        <v-row>
          <v-col class="col-12 col-md-3">
          </v-col>
          <v-col class="col-12 col-md-9">
          </v-col>
        </v-row>

      </v-col>
    </v-row>
  </section>
</template>

<script>
  import navigationIconComponent from '@/components/navigationIconComponent.vue';
  import  MarchingSquares  from 'marching-squares';
  export default {
    components: {
      navigationIconComponent
    },
    data() {
      return {
        tab: 'upload',
        laminateOptions:[
        { title: 'Glossy', value: 'glossy' },
        { title: 'Matte', value: 'matte' },
        { title: 'Satin', value: 'satin' },
        { title: 'Textured', value: 'textured' }
        ],

        width:10,
        height:10,
        quantity:1,
        comment:'',
        selectedLaminate:null,
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
            title: 'Contour cut',
            value: 'contour_cut'
          },
          {
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
        selectedShape: 'contour_cut',
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
      };
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

  // ... otros métodos ...
  detectContour() {
      const image = this.$refs.image;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;
      
      // Convertir la imagen a un array de valores de opacidad
      const alphaData = [];
      for (let i = 0; i < data.length; i += 4) {
        alphaData.push(data[i + 3] > 128 ? 1 : 0); // 128 es el umbral de transparencia
      }
      console.log(MarchingSquares)
      // Detectar el contorno usando Marching Squares
      const contours = MarchingSquares.getBlobOutlinePaths(alphaData, width, height);
      
      // Crear el path de contorno
      let pathString = '';
      contours.forEach(contour => {
        pathString += 'M' + contour.map(point => `${point[0]},${point[1]}`).join('L') + 'Z';
      });
      console.log(pathString)
      // Aplicar el contorno a la imagen
      this.$refs.image.style.clipPath = `path('${pathString}')`;
    },
      stopResize() {
        this.isResizing = false;
        document.removeEventListener('mousemove', this.onResize);
        document.removeEventListener('mouseup', this.stopResize);
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
         this.$nextTick(this.detectContour);
       } else {
         this.$refs.image.style.clipPath = '';
       }
     },
   },
  };

</script>


<style>
.v-application{
    background: #f5f5f5!important;
}
  .image-container {
    margin-top: 20px;
    text-align: center;
    position: relative;
    display: inline-block;
    padding: 20px;
    background-color: black;
  }

  .image-container img {
    max-width: 100%;
    max-height: 400px;
  }
  .editor-container {
    background: #f5f5f5;
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .resizable {
    position: relative;
    display: inline-block;
  }

  .image-wrapper {
    position: relative;
    display: inline-block;
  }

  .resize-handle {
    width: 10px;
    height: 10px;
    background: red;
    position: absolute;
    bottom: 0;
    right: 0;
    cursor: se-resize;
  }

  .center-horizontal {
    position: absolute;
    top: 50%;
    right: -40px;
    transform: translateY(-50%);
  }

  .center-vertical {
    position: absolute;
    left: 50%;
    bottom: -40px;
    transform: translateX(-50%);
  }


  .square {
    clip-path: inset(0%);
  }

  .circle {
    clip-path: circle(50%);
  }

  .rounded_corners {
    clip-path: inset(0% round 15%);
  }

  .text-overlay {
    position: absolute;
    cursor: move;
    color: white;
    font-size: 24px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .selected_shape {
    border: 1px solid red;
  }

  .full-width {
    width: 100%;
  }

</style>
