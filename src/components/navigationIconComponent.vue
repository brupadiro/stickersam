<template>
  <div class="d-flex justify-center align-center flex-column icon-button" :class="(selected)?'selected-button':''">
    <img :src="`/icons/${iconButton}.png`" width="40">
    <span  class="text-caption" :class="(selected)?'black--text':''">
        <slot></slot>
    </span>
  </div>

</template>

<script>
  export default {
    props:{
        selected:{
            type:Boolean,
            default:false
        },
        icon:{
            type:String,
            default:''
        }
    },
    computed:{
        iconButton(){
            return (this.selected == true) ? this.icon + '-dark':this.icon
        }
    }
  }

</script>

<style>
.icon-button{
    cursor:pointer;
    height:70px;
}
.selected-button{
    background:#cecece
}
.black--text{
    color:black!important;
}
</style>
