export default {
    data() {
      return {
        textRotation: 0,
      };
    },
    methods: {
      startTextRotate(event) {
        if (this.textRotation != 360) {
          this.textRotation += 90;
        } else {
          this.textRotation = 0;
        }
      },
    }
  };