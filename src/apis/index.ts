/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2022-12-20 15:49:45
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-20 15:50:17
 */
import { GET_INFOS, GET_INFOS1, GET_LIST } from './api';
import axios from '../request/index';

export const getInfos = axios.get(GET_INFOS);
export const getInfos1 = axios.get(GET_INFOS1);
export const getList = axios.get(GET_LIST);
