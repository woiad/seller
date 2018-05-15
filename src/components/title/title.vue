<template>
  <div class="title-line">
    <div class="line"></div>
    <div class="text">{{text}}</div>
    <div class="line"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      text: {
        type: String
      }
    }
  };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  .title-line
    display: flex
    width: 80%
    margin: 28px auto 24px auto
    .line
      flex: 1
      position: relative
      top: -6px
      border-bottom: 1px solid rgba(255, 255, 255, 0.2)
    .text
      font-size: 12px;
      line-height: 24px
      font-weight: 700
      color: rgb(255, 255, 255)
      padding: 0 12px
</style>
