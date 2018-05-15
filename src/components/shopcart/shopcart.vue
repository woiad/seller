<template>
  <div class="shopcart-wrapper">
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'higlight':totalCount > 0}">
              <i class="icon-shopping_cart" :class="{'higlight':totalCount > 0}"></i>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'higlight':totalPrice > 0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" v-for="(ball, index) in balls" :key="index">
          <div  class="ball"  :key="index" v-show="ball.show" v-bind:css="false">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow" :class="{'fold':listShow}">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li v-for="(food,index) in selectFood" class="food" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.count*food.price}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontroll :food="food"></cartcontroll>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-marsk" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  import cartcontroll from '.././cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';
  export default {
    props: {
      selectFood: {
        type: Array,
        default() {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: false
      };
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFood.forEach((foods) => {
          total += foods.price * foods.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFood.forEach((foods) => {
          count += foods.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}起送`;
        } else {
          return '去结算';
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow: {
        set() {
          if (!this.fold) {
            this.fold = true;
            return false;
          } else {
            let show = !this.fold;
            return show;
          }
        },
        get() {
          return this.fold;
        }
      }
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
              ball.show = true;
              ball.el = el;
              this.dropBalls.push(ball);
              return;
          }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = 'block';
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
            el.style.transform = `translate3d(0, ${y}px, 0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      enter(el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
          this.$nextTick(() => {
            el.style.webkitTransform = 'translate3d(0, 0, 0)';
            el.style.transform = 'translate3d(0, 0, 0)';
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = 'translate3d(0, 0, 0)';
            inner.style.transform = 'translate3d(0, 0, 0)';
          });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
        if (this.fold) {
          console.log(this.$refs.listContent);
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
      },
      empty() {
        this.fold = !this.fold;
        this.selectFood.forEach((food) => {
          food.count = 0;
        });
      },
      hideList() {
        this.fold = !this.fold;
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    },
    components: {
      cartcontroll
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/style/mixin.styl'
  .shopcart
    position: fixed
    left: 0px
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          -webkit-border-radius: 50%
          -moz-border-radius: 50%
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            -webkit-border-radius: 50%
            -moz-border-radius: 50%
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.higlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.higlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700px
            color: #ffffff
            background: rgb(240, 20, 20)
            -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
            -moz-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.higlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 150px
        width: 150px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s
      &.drop-transition
        transition: all 0.4s
      .inner
        width: 16px
        height: 16px
        border-radius: 50%
        background: rgb(0, 160, 220)
        transition: all 0.4s
    .shopcart-list
       position: absolute
       left: 0
       top: 0
       z-index: -1
       width: 100%
       transition: all 0.5s
       transform: translate3d(0, -100%, 0)
       .list-header
         height: 40px
         line-height: 40px
         padding: 0 18px
         background: #f3f5f7
         border-bottom: 1px solid rgba(7, 17, 27, 0.1)
         .title
           float: left
           font-sizew: 14px
           color: rgb(7, 17, 27)
         .empty
           float: right
           font-size: 12px
           color: rgb(0, 160, 220)
       .list-content
         padding: 0 18px
         max-height: 217px
         overflow: hidden
         background: #fff
         .food
           position: relative
           padding: 12px 0
           box-sizing: border-box
           border-1px(rgba(7, 17, 27, 0.1))
           .name
             line-height: 24px
             font-size: 14px
             color: rgb(7, 17, 27)
           .price
             position: absolute
             right: 90px
             bottom: 10px
             line-height: 24px
             font-size: 14px
             font-weight: 700
             color: rgb(240, 20, 20)
           .cartcontrol-wrapper
             position: absolute
             right: 0
             bottom: 6px
    .fold-enter
      transform: translate3d(0, 0, 0)
    .fold-leave-active, .fold-leave-active
      transition: all 0.5s
    .fold-enter-to
      transform: translate3d(0, -100%, 0)
    .fold-leave-to
      transform: translate3d(0, 0, 0)
  .list-marsk
    position: fixed
    top: 0px
    left: 0
    width: 100%
    height: 100%
    opacity: 1
    z-index: 40
    background: rgba(7, 17, 27, 0.6)
    -webkit-backdrop-filter: blur(10px)
  .fade-enter, .fade-leave-to
    opacity: 0
  .fade-enter-active, .fade-leave-active
    transition: opacity 0.5s
    background: rgba(7, 17, 27, 0.6)
</style>
