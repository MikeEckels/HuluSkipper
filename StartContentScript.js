
console.log("Start Content Script Running")

let adID = 1
let skip = null
let startMsg = {
  Info: "Requesting URL State",
  data: 0
}
let commPort =  null

commPort = chrome.runtime.connect()
disbatchMsg()

function onMsgReceive(reply) {
  console.log(reply.Info)
  switch (reply.data) {
    case 0:
      startMsg.Info = "[?] Requesting URL State"
      startMsg.data = 0
      disbatchMsg()
      break
    case 1:
      startMsg.Info = "[?] Requesting Video-Checking Service Start"
      startMsg.data = 1
      disbatchMsg()
      break
    case 2:
      startMsg.Info = "[?] Start Verified"
      startMsg.data = null
      addDisplayChangeListener("ad-top-bar-container", (contentType) => {
        if (contentType === 1) {
          console.log("Show is Playing")
          window.clearInterval(skip)
          changeSpeed(1)
        }else if (contentType === 0) {
          console.log("Ad is Playing")
          skip = window.setInterval(changeSpeed,1000, 10)
        }
      })
      disbatchMsg()
      break
  }
}

function disbatchMsg() {
  commPort.postMessage(startMsg)
  commPort.onMessage.addListener(onMsgReceive)
}

function addDisplayChangeListener(className, callback) {
    let displayType = null
    let lastDisplayType = null
    let adSlot = document.getElementsByClassName(className)

    for (let j = 0; j < adSlot.length; j++) {
      lastDisplayType = adSlot[j].style.display
    }
    window.setInterval( () => {
      for (let k = 0; k < adSlot.length; k++) {
        displayType = adSlot[k].style.display
      }

      if (displayType !== lastDisplayType) {
        if (displayType === "none") {
          callback(1)//Show is playing
        }else {
          callback(0)//Ad is playing
        }
        lastDisplayType = displayType
      }
    },10)
}

function changeSpeed(speed) {
  let player = document.getElementsByClassName('video-player')

  for (let i = 0; i < player.length; i++) {
    player[i].playbackRate = speed
  }
}

/*
function disbatchMsg() {
  liftedResolve = null
  liftedReject = null
  msgReceivedPromise = new Promise((resolve, reject) => {
      liftedResolve = resolve
      liftedReject = reject
  })

  chrome.runtime.sendMessage(startMsg, (reply) => {
      liftedResolve()
      onMsgReceive(reply)
  })
  return msgReceivedPromise
}
*/
