
console.log('Background Script Running')

let urlRegEx = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)(?:[^\/\n]*\.)*hulu\.com.watch(?:\/[^\n]*)?$/
//let urlRegEx = /^(?:http:\/\/|https:\/\/)(:?www\.)?hulu\.com.watch\/?/
let currentUrl = null;
let mutedInfo = null;
let bgResponse = {
  Info: null,
  data: null
}

function onConnect(port) {
  let msgFunc = (msg) => {
    onMsg(port, msg)
  }
  port.onMessage.addListener(msgFunc)
}

function onMsg(port, msg) {
  //currentUrl = sender.url //doesnt update with PJ5 Ajax calls (hulu, youtube, etc.)
  //mutedInfo = sender.tab.mutedInfo
  console.log(msg.Info)
  switch (msg.data) {
    case 0:
      if (currentUrl.match(urlRegEx)) {
        bgResponse.Info = "[+] Watching Content"
        bgResponse.data = 1
        port.postMessage(bgResponse)
        //updateIcon(1)
      }else {
        bgResponse.Info = "[!] Not on Correct URL"
        bgResponse.data = 0
        port.postMessage(bgResponse)
        //updateIcon(0)
      }
      break
    case 1:
      //do stuff here to verify youre ready for ad service
      bgResponse.Info = "[+] Request accepted, begin service"
      bgResponse.data = 2
      port.postMessage(bgResponse)
      break
  }
  //console.log(mutedInfo)
  //console.log(currentUrl)
}

chrome.runtime.onConnect.addListener(onConnect)

chrome.tabs.onUpdated.addListener(function() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
    currentUrl = tabs[0].url
  })
})

/*
//Not properly working yet. Doesnt get proper url update
function updateIcon(isActive) {
  if (isActive) {
    chrome.browserAction.setIcon({path: "Icons/16.png"})
  }else {
    chrome.browserAction.setIcon({path: "Icons/disabled16.png"})
  }
}
*/
