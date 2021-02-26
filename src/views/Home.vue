<template>
  <div class="home">
    <h1>视频会议系统</h1>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      //信令对象
      p2pVideoCall: null,
    }
  },
  methods: {
    connectServer() {
      const this_ = this
      //WebSocket连接url
      const p2pUrl = 'wss://' + window.location.hostname + ':8000/ws'
      const turnUrl = 'https://' + window.location.hostname + ':9000/api/turn?service=turn&username=sample'
      console.log("信令服务器地址:" +p2pUrl)
      console.log("中转服务器地址:" +turnUrl)
      //初始化信令 传入url及名称
      this.p2pVideoCall = new P2PVideoCall(p2pUrl, turnUrl, this.state.userName, this.state.roomId)
      //监听更新用户列表事件
      this.p2pVideoCall.on('updateUserList', (users, self) => {
        this.$store.dispatch('setState', { users, userId: self })
      })
      //监听新的呼叫事件
      this.p2pVideoCall.on('newCall', (from, sessios) => {
        this.$store.dispatch('setState', { isVideoCall: true })
      });
      //监听新本地流事件
      this.p2pVideoCall.on('localstream', (stream) => {
        this.$store.dispatch('setState', { localStream: stream })
      });
      //监听新远端流添加事件
      this.p2pVideoCall.on('addstream', (stream) => {
        this.$store.dispatch('setState', { remoteStream: stream })
      });
      //监听远端流移除事件
      this.p2pVideoCall.on('removestream', (stream) => {
        this.$store.dispatch('setState', { remoteStream: null })
      });
      //监听会话结束事件
      this.p2pVideoCall.on('hangUp', (to, session) => {
        this.$store.dispatch('setState', { 
          isVideoCall: false, 
          localStream: null, 
          remoteStream: null 
        })
      })
      //监听离开事件
      this.p2pVideoCall.on('leave', (to) => {
        this.$store.dispatch('setState', { isVideoCall: false, localStream: null, remoteStream: null })
      });
    },
    
    //呼叫对方参与会话
    handleStartCall(remoteUserId, type) {
      this.p2pVideoCall.startCall(remoteUserId, type)
    },
    
    //挂断处理
    handleUp() {
      this.p2pVideoCall.hangUp()
    },

    //打开/关闭本地视频
    onVideoOnClickHandler() {
      let videoMuted = this.$store.state.videoMuted
      this.onToggleLocalVideoTrack(videoMuted)
      this.$store.dispatch('setState', { videoMuted })
    },

    onToggleLocalVideoTrack (muted) {
      //获取所有视频频轨道
      let videoTracks = this.$store.state.localStream.getVideoTracks()
      if (videoTracks.length === 0) {
        console.log("没有本地视频.")
        return
      }
      console.log("打开/关闭本地视频.")
      //循环迭代所有轨道
      for (let i = 0; i < videoTracks.length; ++i) {
        //设置每个轨道的enabled值
        videoTracks[i].enabled = !muted
      }
    },

    //打开/关闭本地音频
    onAudioClickHandler() {
      let audioMuted = !this.$store.state.audioMuted
      this.onToggleLocalAudioTrack(audioMuted)
      this.$store.dispatch('setState', { audioMuted:audioMuted })
    },

    onToggleLocalAudioTrack(muted) {
      //获取所有音频轨道
      let audioTracks = this.$store.state.localStream.getAudioTracks()
      if (audioTracks.length === 0){
        console.log("没有本地音频")
        return
      }
      console.log("打开/关闭本地音频.")
      //循环迭代所有轨道
      for (let i = 0; i<audioTracks.length; ++i){
        //设置每个轨道的enabled值
        audioTracks[i].enabled = !muted
      }
    },

    loginHandler(userName,roomId) {
      this.$store.dispatch('setState', {
        isLogin:true,
        userName:userName,
        roomId:roomId,
      })
      this.connectServer();
    }
  }
}
</script>
