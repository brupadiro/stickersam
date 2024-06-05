import rotationMixin from './rotationMixin';
import positioningMixin from './positioningMixin';
import resizeMixin from './resizeMixin';

export default {
  mixins: [rotationMixin, positioningMixin, resizeMixin],
  data() {
    return {
      stickerText: '',
      textFont: 'Arial',
      textColor: 'black',
      textAlign: 'left',
      showControls: false,
      controlOffsets: {
        rotate: { x: -15, y: 15 },
        resize: { x: 90, y: 15 },
        verticalAlign: { x: 55, y: 15 },
        horizontalAlign: { x: 20, y: 15 }
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
  methods: {
    onTextClick() {
      this.showControls = true;
      this.updateControlPositions();
    },
    handleDocumentClick(event) {
      if (!this.$el.contains(event.target)) {
        this.showControls = false;
      }
    },
    updateTextFont(newFont) {
      this.textFont = newFont;
    },
    updateTextAlign(newAlign) {
      this.textAlign = newAlign;
    },
    updateStickerText(newText) {
      this.stickerText = newText;
      this.updateControlPositions();
    },
    updateTextColor(newColor) {
      this.textColor = newColor;
    },
    calculateTextWidth() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `${this.textSize}px ${this.textFont}`;
      return context.measureText(this.stickerText).width;
    },
    updateTextMetrics() {
      this.$nextTick(() => {
        const textElement = this.$refs.textElement;
        if (textElement) {
          const bbox = textElement.getBBox();
          this.borderRect = {
            x: bbox.x - 5,
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