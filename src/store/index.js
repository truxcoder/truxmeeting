import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //Users数组
    users: [],
    //自己Id
    userId: null,
    //用户名
    userName:'',
    //房间号
    roomId:'111111',
    //是否正在视频通话
    isVideoCall: false,
    //是否登录房间
    isLogin:false,
    //本地流
    localStream: null,
    //远端流
    remoteStream: null,
    //禁用音频
    audioMuted: false,
    //禁用视频
    videoMuted: false,
  },
  mutations: {
    SETSTATE (state,payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    setState ({ commit }, newState) {
      commit('SETSTATE', newState)
    }
  },
  modules: {
  }
})
