<template>
  <v-card flat>
    <v-card-text>
      <v-row no-gutters>

        <v-col cols="6" class="px-2">
          <v-label class="full-width text-overline font-weight-bld black--text">Font</v-label>
          <div style="position: relative;">
            <select v-model="localTextFont" @change="importFont()" style="appearance: none; -webkit-appearance: none; -moz-appearance: none;">
              <option class="font-weight-light" v-for="font in availableFonts" :key="font" :value="font">
                {{ font }}</option>
            </select>
            <span
              style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none;">&#9660;</span>
          </div>
        </v-col>
        <v-col cols="6" class="px-2">
          <v-label class="full-width text-overline font-weight-bold black--text">Align</v-label>
          <div style="position: relative;">
            <select v-model="localTextAlign" style="appearance: none; -webkit-appearance: none; -moz-appearance: none;">
              <option class="font-weight-light" value="start">
                Left
              </option>
              <option class="font-weight-light" value="middle">
                Center
              </option>
              <option class="font-weight-light" value="end">
                Midle
              </option>
            </select>
            <span
              style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none;">&#9660;</span>
          </div>
        </v-col>
        <v-col cols="12" class="px-2 py-2 d-flex justify-center align-center">
          <textarea v-model="localStickerText" placeholder="Enter text"
            style="border:1px solid #cecece; width:100%;border-radius:5px"></textarea>
        </v-col>

        <v-col cols="12">
          <v-color-picker v-model="localTextColor" flat hide-inputs elevation="0" position="relative" width="100%">
          </v-color-picker>
        </v-col>
      </v-row>

    </v-card-text>
  </v-card>


</template>

<script>
  export default {
    data() {
      return {
        localTextFont: 'Roboto',
        localTextAlign: 'middle',
        localStickerText: '',
        localTextColor: '',
        availableFonts: [
        'Roboto', 'Open Sans', 'Lato', 'Slabo 27px', 'Oswald',
        'Source Sans Pro', 'Montserrat', 'Raleway', 'PT Sans',
        'Roboto Condensed', 'Poppins', 'Noto Sans', 'Ubuntu',
        'Merriweather', 'Lora', 'Roboto Mono', 'Rubik', 'Playfair Display',
        'Arimo', 'Mukta'
        ],
      }
    },
    mounted(){
      this.importFont('Roboto')
    },
    methods:{
    importFont(fontName) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css?family=${this.localTextFont.replace(/ /g, '+')}:400,700`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    },
    },
    watch: {
      localTextFont(newVal) {
        this.$emit('update:textFont', newVal);
      },
      localTextAlign(newVal) {
        this.$emit('update:textAlign', newVal);
      },
      localStickerText(newVal) {
        this.$emit('update:stickerText', newVal);
      },
      localTextColor(newVal) {
        this.$emit('update:textColor', newVal);
      }
    },
  }

</script>

<style>

</style>
