<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <h1>Personalizador de pegatinas</h1>
        <h4 class="py-6">Haga sus propias pegatinas de vinilo personalizadas en nuestro material de pegatinas más
          vendido y duradero.
        </h4>
        <p>
          ¿Qué es lo que no le gusta de nuestro material adhesivo más funcional y sencillo? Cuando crea su pegatina
          personalizada en nuestro material de vinilo blanco más popular, abre la puerta a un sinfín de posibilidades de
          diseño. Elija entre una gran variedad de opciones adicionales, como impresión en papel posterior, laminados
          alternativos y tintas creativas; todo vale cuando se trata de material de vinilo.
        </p>


      </v-col>
      <v-col md="6">
        <img src="https://www.stickersam.com/wp-content/uploads/2023/06/dc9553009268d3a1eeaa84c43502ae05c18f63d2.jpg"
          width="80%">
      </v-col>
    </v-row>
  </v-container>
  <v-container class="grey">

    <v-row>
      <v-col class="col-12">
        <h1>Make customized stickers</h1>
        <p>Choose your desired cutline, size, quantity and material. Upload your design and go to our editor.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-12 col-md-3">
        <div>
          <h3>Product</h3>
          <v-select variant="solo-filled" label="Select Product" :items="productItems"></v-select>
        </div>
        <div>
          <h3>Shape</h3>
          <v-list :items="shapeItems">
          </v-list>

        </div>
      </v-col>
      <v-col class="col-12 col-md-4">
        <h3>Material</h3>
        <v-row>
          <v-radio-group v-model="selectedMaterial" class="material-radio-group">
            <v-radio v-for="material in materialItems" :key="material.value" :label="material.label"
              :value="material.value" :disabled="material.disabled">
              <template v-slot:label>
                <v-row align="center">
                  <v-col cols="4">
                    <v-img :src="material.icon" height="100px" contain></v-img>
                  </v-col>
                  <v-col cols="8">
                    {{ material.label }}
                  </v-col>
                </v-row>
              </template>
            </v-radio>
          </v-radio-group>
        </v-row>
      </v-col>
      <v-col class="col-12 col-md-2">
        <h3>Size</h3>
      </v-col>
      <v-col class="col-12 col-md-3">
        <h3>Quantity</h3>
      </v-col>

    </v-row>

  </v-container>
</template>

<script>
  export default {
    data() {
      return {
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
            title: 'Rouned corners',
            value: 'rounded_corners'
          },
        ],
        selectedShape: null,
        materialItems: [{
            title: 'Material A',
            value: 'material_a',
            img: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/06/08/4d0ae46e9e164daa9171d70e51cd46c7acaa2419.png'
          },
          {
            title: 'Material A',
            value: 'material_a',
            img: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/48e2c5c8c6ab57d013675b3b245daa2136e0c7cf.png'
          },
          {
            title: 'Material A',
            value: 'material_a',
            img: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/8d48777356c014861f8e174949f2a382778c0a7e.png'
          },
          {
            title: 'Material A',
            value: 'material_a',
            img: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/c5e0f009dbf3aec33b2e8d0caac5ebcd1a10348f.png'
          },
          {
            title: 'Material A',
            value: 'material_a',
            img: ''
          },
          {
            title: 'Material A',
            value: 'material_a',
            img: ''
          },
        ]
      };
    }
  }

</script>
