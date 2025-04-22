/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2022-12-20 15:49:45
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-22 09:56:56
 */
import { GET_INFOS, GET_INFOS1, GET_LIST, getAreaCascadeList } from './api';
import axios from '../request/index';

export const getInfos = axios.get(GET_INFOS);
export const getInfos1 = axios.get(GET_INFOS1);
export const getList = axios.get(GET_LIST);
export const getAreaCascadeListData = (params: Object) =>
  axios.post(getAreaCascadeList, params);
