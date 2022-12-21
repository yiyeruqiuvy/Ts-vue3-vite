/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2022-12-19 15:46:48
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-19 16:08:09
 */
// store.js
import { defineStore } from 'pinia';

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: 'myGlobalState',
    // state: 返回对象的函数
    state: () => ({
        count: 3,
    }),
    actions: {
        increaseCount() {
            this.count++;
        },
    },
});
