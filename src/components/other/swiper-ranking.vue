<!--
 * @Descripttion: 轮播排行组件
 * @Author: peiqf
 * @Date: 2022-07-20 20:49:25
 * @LastEditors: peiqf
 * @LastEditTime: 2023-01-03 10:43:24
-->

<template>
    <div>
        <div
            ref="ranking"
            class="ranking"
            :style="{ width: carouselOption.headStyle.carouselWidth }"
        >
            <!-- 表头 -->
            <div
                class="rankingHead"
                :style="{
                    width: carouselOption.headStyle.carouselWidth,
                    height: carouselOption.headStyle.headHeight,
                }"
            >
                <span v-for="item in carouselOption.carouselHead" :key="item">
                    {{ item.label }}
                </span>
            </div>
            <!-- 表格数据 -->
            <div class="carouselRanking">
                <swiper
                    :slides-per-view="1"
                    :loop="true"
                    :autoplay="autoplayOptions"
                    direction="vertical"
                    :modules="[Autoplay]"
                    :style="{ height: carouselOption.headStyle.carouselHeight }"
                    @swiper="onSwiper"
                >
                    <swiper-slide
                        v-for="(items, index) in gruopData"
                        :key="index"
                        :style="{ height: carouselOption.headStyle.carouselHeight }"
                    >
                        <div
                            v-for="(item, idx) in items"
                            :key="idx"
                            class="carouselRow"
                            :class="index == 0 && idx < carouselOption.top ? 'carouselRow-top' : ''"
                            :style="{
                                background: idx % 2 == 0 ? evenBgColor : oddBgColor,
                            }"
                        >
                            <span
                                v-for="(headItem, headIndex) in carouselOption.carouselHead"
                                :key="headIndex"
                                :title="item[carouselOption.HeadType[headIndex]]"
                                :style="{
                                    width: carouselOption.carouselHead[headIndex].width,
                                }"
                                class="span"
                            >
                                {{ item[carouselOption.HeadType[headIndex]] }}
                            </span>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="swiperRanking">
    // import Swiper from 'swiper';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Autoplay } from 'swiper';
    import 'swiper/css';
    import 'swiper/css/autoplay';

    import { ref, watchEffect, onMounted, reactive } from 'vue';
    // const { proxy } = getCurrentInstance();
    const props = defineProps({
        // 表格数据
        carouselData: {
            type: Array,
            default: () => {
                return [];
            },
        },
        // 表头配置
        carouselOption: {
            type: Object,
            default: () => {
                return {};
            },
        },
        evenBgColor: {
            type: String,
            default: () => {
                return '#06223d';
            },
        },
        oddBgColor: {
            type: String,
            default: () => {
                return '#092946';
            },
        },
    });
    let gruopData = reactive([]);

    //自动轮播的配置
    const autoplayOptions = reactive({
        delay: props.carouselOption.delay,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        // reverseDirection: true,//改变顺序，怪！
    });
    // 分组处理数据
    function handleData() {
        gruopData = [];
        gruopData[0] = [];
        let data = props.carouselData;
        for (let i = 0, j = 0; i < data.length; i++) {
            if ((i + 1) % props.carouselOption.pagSize !== 0) {
                gruopData[j].push(data[i]);
            } else {
                gruopData[j].push(data[i]);
                if (i + 1 !== data.length) {
                    j++;
                    gruopData[j] = [];
                }
            }
        }
    }
    // 获取swiper实例
    let mySwiper = ref<typeof Swiper>();
    const onSwiper = (swiper: typeof Swiper) => {
        mySwiper.value = swiper;
    };
    // 是否停止轮播
    let isAuto = ref<Boolean>(true);
    // 监听当数据不够轮播的时候停止轮播
    watchEffect(() => {
        handleData();
        if (gruopData.length === 1) {
            mySwiper.value.autoplay.stop();
            isAuto.value = false;
        } else if (!isAuto.value) {
            mySwiper.value.autoplay.start();
            isAuto.value = true;
        }
    });

    // 轮播
    // function swiper() {
    //     // let _this = this;
    //     // mySwiper[props.carouselIdx].mySwiper = new Swiper('#' + props.swiperId, {
    //     mySw.value = new Swiper('#' + props.swiperId, {
    //         loop: true,
    //         direction: 'vertical',
    //         observer: true, //修改swiper自己或子元素时，自动初始化swiper
    //         observeParents: true, //修改swiper的父元素时，自动初始化swiper
    //         autoplay: {
    //             delay: 200,
    //             disableOnInteraction: false,
    //             // pauseOnMouseEnter: true,
    //         },
    //         on: {
    //             tap: function (event) {
    //                 // let arr = event.target.parentNode.innerText.split('\n');
    //                 console.log(event);
    //                 // console.log()
    //                 // let year = Number(event.target.parentNode.childNodes[4].innerHTML);
    //                 // if (_this.carouselHead[2] !== '信用承诺数量') {
    //                 //     _this.$emit('openModal', {
    //                 //         name: arr[1],
    //                 //         year: year,
    //                 //     });
    //                 // }
    //             },
    //         },
    //     });
    //     console.log(mySw);
    //     swiperPause(mySw);
    // }
    // 鼠标移上移出停止轮播
    // function swiperPause(mySwiper: any) {
    //     if (mySwiper) {
    //         let comtainer = document.getElementById(props.swiperId);
    //         comtainer.addEventListener('mouseenter', function () {
    //             // console.log(mySwiper.autoplay)
    //             if (mySwiper.autoplay) {
    //                 mySwiper.autoplay.stop();
    //             }
    //             // mySwiper.autoplay.stop()
    //         });
    //         comtainer.addEventListener('mouseleave', function () {
    //             if (mySwiper.autoplay) {
    //                 mySwiper.autoplay.start();
    //             }
    //         });
    //     }
    // }
    onMounted(() => {
        handleData();
        // console.log(gruopData);
    });
    // onUpdated(() => {
    //     swiper();
    // });
</script>

<style lang="less" scoped>
    .ranking {
        width: 3.88rem;
        height: calc(100% - 0.4rem);
    }
    .rankingHead {
        display: flex;
        align-items: center;
        width: 8.17rem;
        height: 0.3rem;

        // background: linear-gradient(0deg, rgba(38, 185, 253, 0.24));
        // box-shadow: 0px -1px 0px 0px rgba(64, 162, 253, 0.6);

        background: linear-gradient(180deg, #072742 0%, #0e4165 100%);
        box-shadow: 0px 1px rgba(64, 162, 253, 0.6);
        // border-bottom: 0.01rem solid rgba(21, 87, 134, 0.58);

        margin-top: 0.22rem;
    }
    .rankingHead span {
        display: block;
        text-align: center;
        font-size: 0.14rem;
        font-weight: 400;
        color: #f2fcfd;
        font-family: SourceHanSansCN-Regular;
    }

    .carouselRanking {
        // height: 1.55rem;
        overflow: hidden;
        .carouselRow {
            height: 0.42rem;
            // background: rgba(6, 68, 91, 0.2);
            // background: #06223d;
            // background: #06445b; // ,#082845
            color: #f2fcfd;
            text-align: center;
            // border: 0.01rem solid rgba(21, 87, 134, 0.58);
            margin: 0 0 0.027rem 0;
            display: flex;
        }
    }

    @keyframes active {
        0% {
            transform: translateX(-30%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
    .swiper-slide-active > div:nth-child(1) {
        animation: active 1s forwards;
    }
    .swiper-slide-active > div:nth-child(2) {
        animation: active 1.1s forwards;
    }
    .swiper-slide-active > div:nth-child(3) {
        animation: active 1.2s forwards;
    }
    .swiper-slide-active > div:nth-child(4) {
        animation: active 1.3s forwards;
    }
    .swiper-slide-active > div:nth-child(5) {
        animation: active 1.4s forwards;
    }
    .swiper-slide-active > div:nth-child(6) {
        animation: active 1.4s forwards;
    }
    .swiper-slide-active > div:nth-child(7) {
        animation: active 1.4s forwards;
    }
    .swiper-slide-active > div:nth-child(8) {
        animation: active 1.4s forwards;
    }
    .swiper-slide-active > div:nth-child(9) {
        animation: active 1.4s forwards;
    }
    .swiper-slide-active > div:nth-child(10) {
        animation: active 1.4s forwards;
    }

    .carouselRow span {
        display: inline-block;
        text-align: center;
        line-height: 0.48rem;
        font-size: 0.14rem;
        font-weight: 400;
        // color: linear-gradient(0deg, #f6ce54 0%, #fff4d8 100%);
        color: #f2fcfd;
        // -webkit-background-clip: text;
        white-space: nowrap;
        // -webkit-text-fill-color: transparent;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .carouselRow-top span {
        background: linear-gradient(0deg, #f6ce54 0%, #fff4d8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .carouselRow .col-1,
    .rankingHead span:nth-child(1) {
        width: 10%;
    }
    .carouselRow .col-2,
    .rankingHead span:nth-child(2) {
        width: 30%;
    }
    .carouselRow .col-3,
    .rankingHead span:nth-child(3) {
        width: 30%;
    }
    .carouselRow .col-4,
    .rankingHead span:nth-child(4) {
        width: 30%;
    }
    // .carouselRow .col-5,
    // .rankingHead span:nth-child(4) {
    //   width: 1%;
    // }
    .swiper-slide {
        cursor: pointer;
    }
</style>
