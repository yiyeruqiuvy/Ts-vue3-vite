<template>
    <div class="numbers">
        <span :id="uid"></span>
    </div>
</template>
<script setup lang="ts" name="single-number">
    import { ref, watchEffect, onMounted, nextTick } from 'vue';
    import CountUp from 'countup';
    const props = defineProps({
        // 动画延迟自定义事件（自定义属性）
        delay: {
            type: Number,
            default: 0,
        },
        startVal: {
            type: Number,
            default: 0,
        },
        endVal: {
            type: Number,
            require: true,
        },
        decimals: {
            type: Number,
            default: 0,
        },
        duration: {
            type: Number,
            default: 2,
        },
        useEasing: {
            type: Boolean,
            default: true,
        },
        useGrouping: {
            type: Boolean,
            default: true,
        },
        separator: {
            type: String,
            default: ',',
        },
        decimal: {
            type: String,
            default: '.',
        },
    });
    let counter = ref<any>();
    const uid = `count_up_${'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    })}`;

    // 分组处理数据
    function initData() {
        nextTick(() => {
            // 创建实例
            // 第一个参数为target用来匹配id值,通过计算属性可以解决id值的问题
            // 第二个参数为startVal，用来定义起始值（通过props属性传入）
            // 第三个参数为endVal,用来定义最终值
            // 第四个参数decimals用来定义小数点后保留几位
            // 第五个参数duration表示动画持续时间
            // 第六个参数为一个配置对象
            // 第一个参数useEasing设置变化速度 true为变速 false为匀速
            // 第二个参数useGrouping设置分组效果 true为变速 false为匀速
            // 第三个参数separatot设置分组符号
            // 第四个参数decimal设置小数分组符号
            counter.value = new CountUp(
                uid,
                props.startVal,
                props.endVal,
                props.decimals,
                props.duration,
                {
                    useEasing: props.useEasing,
                    useGrouping: props.useGrouping,
                    separator: ',',
                    decimal: '.',
                }
            );
            setTimeout(() => {
                counter.value.start();
            }, props.delay);
        });
    }

    // 监听数据更新
    watchEffect(() => {
        initData();
    });
    onMounted(() => {
        initData();
    });
</script>

<style lang="less" scoped>
    .numbers {
        display: inline-block;
        span {
            font-family: PangMen;
        }
    }
</style>
