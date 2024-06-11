var isConnected = false;
var buttons_1 = document.querySelectorAll('.btn-group-1');
var buttons_2 = document.querySelectorAll('.btn-group-2');

window.onload = function() {
  fetch('/static/config.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      connectToWebSocket(data.qlcplusIP);
      setTimeout(function() {
        var connStatus = document.getElementById('connStatus');
        var moreOptions = document.getElementById('moreOptions');
        if (connStatus) {
          connStatus.classList.remove('d-none');
        }
        if (moreOptions) {
          moreOptions.classList.remove('d-none');
        }
      }, 150);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
};

document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.btn-group-2');

  buttons.forEach(button => {
      button.addEventListener('click', function() {
          // Check if the clicked button is already active
          if (this.classList.contains('active')) {
              // If yes, remove the active class to untoggle
              this.classList.remove('active');
              this.classList.remove('hover')
          } else {
              // Otherwise, remove active class from all buttons
              buttons.forEach(btn => btn.classList.remove('active'));
              // And add active class to the clicked button
              this.classList.add('active');
          }
      });
  });
});

function updateJsonAndReload() {
  var qlcplusIP = document.querySelector('.form-control').value;
  fetch('/update_json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({qlcplusIP: qlcplusIP})
  }).then(function(response) {
    window.location.reload();
  }).catch(function(error) {
    console.error('Error:', error);
  });
}

function requestAPI(cmd) {
  if (isConnected === true)
    websocket.send("QLC+API|" + cmd);
  else
    alert("You must connect to QLC+ WebSocket first!");
}

function requestAPIWithParam(cmd, paramObjName) {
  var obj = document.getElementById(paramObjName);
  if (obj) {
    if (isConnected === true)
      websocket.send("QLC+API|" + cmd + "|" + obj.value);
    else
      alert("You must connect to QLC+ WebSocket first!");
  }
}

function requestAPIWith2Params(cmd, paramObjName, param2ObjName) {
  var obj1 = document.getElementById(paramObjName);
  var obj2 = document.getElementById(param2ObjName);
  if (obj1 && obj2) {
    if (isConnected === true)
      websocket.send("QLC+API|" + cmd + "|" + obj1.value + "|" + obj2.value);
    else
      alert("You must connect to QLC+ WebSocket first!");
  }
}

function requestChannelsRange(cmd, uniObjName, addressObjName, rangeObjName) {
  var uniObj = document.getElementById(uniObjName);
  var addrObj = document.getElementById(addressObjName);
  var rangeObj = document.getElementById(rangeObjName);
  if (uniObj && addrObj && rangeObj) {
    if (isConnected === true)
      websocket.send("QLC+API|" + cmd + "|" + uniObj.value + "|" + addrObj.value + "|" + rangeObj.value);
    else
      alert("You must connect to QLC+ WebSocket first!");
  }
}

function setSimpleDeskChannel2(addressObjName, channelValueObjName) {
  websocket.send("CH|" + addressObjName + "|" + channelValueObjName);
}

function setSimpleDeskChannel(addressObjName, channelValueObjName) {
  var addrObj = document.getElementById(addressObjName);
  var valObj = document.getElementById(channelValueObjName);
  if (addrObj && valObj) {
    if (isConnected === true)
      websocket.send("CH|" + addrObj.value + "|" + valObj.value);
    else
      alert("You must connect to QLC+ WebSocket first!");
  }
}

function vcWidgetSetValue2(wIDObjName, wValueObjName, rangeBarId) {
  websocket.send(wIDObjName + "|" + wValueObjName);
  if (rangeBarId) {
    document.getElementById(rangeBarId).value = wValueObjName / 2.55;
  }
}

function vcWidgetSetValue(wIDObjName, wValueObjName) {
  var wObj = document.getElementById(wIDObjName);
  var valObj = document.getElementById(wValueObjName);
  if (wObj && valObj) {
    if (isConnected === true) {
      websocket.send(wObj.value + "|" + valObj.value);
      console.log("Stopped succesfully");
    }
    else
      alert("You must connect to QLC+ WebSocket first!");
  }
}

function vcCueListControl(clIDObjName, clOpObjName, clStepObjName) {
  var clObj = document.getElementById(clIDObjName);
  var opObj = document.getElementById(clOpObjName);
  var stepObj = document.getElementById(clStepObjName);
  if (clObj && opObj) {
    if (isConnected === true) {
      if (opObj.value === "STEP")
        websocket.send(clObj.value + "|" + opObj.value + "|" + stepObj.value);
      else
        websocket.send(clObj.value + "|" + opObj.value);
    } else
      alert("You must connect to QLC+ WebSocket first!");
  }
}

function vcFrameControl(frIDObjName, frOperation) {
  var frObj = document.getElementById(frIDObjName);
  var opObj = document.getElementById(frOperation);

  if (frObj && opObj) {
    if (isConnected === true) {
      websocket.send(frObj.value + "|" + opObj.value);
    } else
      alert("You must connect to QLC+ WebSocket first!");
  }
}

function wsOnOpen(ev) {
  var connStatus = document.getElementById('connStatus');
  if (connStatus) {
    connStatus.innerHTML = "<span class='text-success'>Connected</span>";
  }
  isConnected = true;
  console.log("Connected to ws")
  getRangebarStatus("9", "rangeBarStrop")
  getRangebarStatus("4", "rangeBarPrezentacie")
  getRangebarStatus("13", "rangeBarRed")
  getRangebarStatus("11", "rangeBarGreen")
  getRangebarStatus("12", "rangeBarBlue")
  
  getButtonStatus('16', 'btn-group-2-4')
  getButtonStatus('17', 'btn-group-2-2')
  getButtonStatus('18', 'btn-group-2-3')
  getButtonStatus('19', 'btn-group-2-1')
};

function wsOnClose(ev) {
  console.log("QLC+ connection lost!", ev);

  var connStatus = document.getElementById('connStatus');
  if (connStatus) {
    connStatus.innerHTML = "<span class='text-danger'>Not connected</span>";
  }
  isConnected = false;
}

function wsOnError(ev) {
  console.log("QLC+ connection error!", ev);
  
  var connStatus = document.getElementById('connStatus');
  if (connStatus) {
    connStatus.innerHTML = "<span class='text-danger'>Not connected</span>";
  }
  isConnected = false;
}

function wsOnMessage(ev) {
  var msgParams = ev.data.split('|');
  if (msgParams[0] === "QLC+API") {
    if (msgParams[1] === "getFunctionsNumber") {
      document.getElementById('getFunctionsNumberBox').innerHTML = msgParams[2];
    } else if (msgParams[1] === "getFunctionsList") {
      var tableCode = "<table class='apiTable'><tr><th>ID</th><th>Name</th></tr>";
      for (var i = 2; i < msgParams.length; i += 2) {
        tableCode += "<tr><td>" + msgParams[i] + "</td><td>" + msgParams[i + 1] + "</td></tr>";
      }
      tableCode += "</table>";
      document.getElementById('getFunctionsListBox').innerHTML = tableCode;
    } else if (msgParams[1] === "getFunctionType") {
      document.getElementById('getFunctionTypeBox').innerHTML = msgParams[2];
    } else if (msgParams[1] === "getFunctionStatus") {
      document.getElementById('getFunctionStatusBox').innerHTML = msgParams[2];
    } else if (msgParams[1] === "getWidgetsNumber") {
      document.getElementById('getWidgetsNumberBox').innerHTML = msgParams[2];
    } else if (msgParams[1] === "getWidgetsList") {
      var tableCode = "<table class='apiTable'><tr><th>ID</th><th>Name</th></tr>";
      for (var i = 2; i < msgParams.length; i += 2) {
        tableCode += "<tr><td>" + msgParams[i] + "</td><td>" + msgParams[i + 1] + "</td></tr>";
      }
      tableCode += "</table>";
      document.getElementById('getWidgetsListBox').innerHTML = tableCode;
    } else if (msgParams[1] === "getWidgetType") {
      document.getElementById('getWidgetTypeBox').innerHTML = msgParams[2];
    } else if (msgParams[1] === "getWidgetStatus") {
      var status = msgParams[2];
      if (status === "PLAY")
        status = msgParams[2] + "(Step: " + msgParams[3] + ")";
      var element = document.getElementById('getWidgetStatusBox');
      if (element) {
        element.innerHTML = status;
      }
    }
    else if (msgParams[1] === "getChannelsValues") {
      var tableCode = "<table class='apiTable'><tr><th>Index</th><th>Value</th><th>Type</th></tr>";
      for (var i = 2; i < msgParams.length; i += 3) {
        tableCode += "<tr><td>" + msgParams[i] + "</td><td>" + msgParams[i + 1] + "</td><td>" + msgParams[i + 2] + "</td></tr>";
      }
      tableCode += "</table>";
      document.getElementById('requestChannelsRangeBox').innerHTML = tableCode;
    }
  }
}

function connectToWebSocket(host) {
  var url = 'ws://' + host + '/qlcplusWS';
  websocket = new WebSocket(url);
  wshost = "http://" + host;

  websocket.onopen = wsOnOpen;
  websocket.onclose = wsOnClose;
  websocket.onerror = wsOnError;
  websocket.onmessage = wsOnMessage;
};

function loadProject() {
  var formAction = wshost + "/loadProject";
  document.getElementById('lpForm').action = formAction;
}

function toggleFunction(functionId) {
  websocket.send("QLC+API|getFunctionStatus|" + functionId);

  websocket.onmessage = function(event) {
    var message = event.data;
    if (message.startsWith("QLC+API|getFunctionStatus|")) {
      var functionStatus = message.split("|")[2];
      if (functionStatus === "Running") {
        websocket.send('QLC+API|setFunctionStatus|' + functionId + '|0');
      } else {
        websocket.send('QLC+API|setFunctionStatus|' + functionId + '|1');
      }
    }
  };
}

function turnOffFunctions(functionsList) {
  for (let i = 0; i < functionsList.length; i++) {
    websocket.send(`QLC+API|setFunctionStatus|${functionsList[i]}|0`);
  }
}

function turnOnFunctions(functionsList) {
  for (let i = 0; i < functionsList.length; i++) {
    websocket.send(`QLC+API|setFunctionStatus|${functionsList[i]}|1`);
  }
}

function turnOnSoloFunctions(functionsList, functionsList2) {
  turnOnFunctions(functionsList);
  turnOffFunctions(functionsList2)
}

function toggleSoloFunction(param1, param2) {
  toggleFunction(param1);
  turnOffFunctions(param2);
}

document.addEventListener("DOMContentLoaded", function() {
  var rangeBar = document.getElementById("rangeBarPrezentacie");
  if (rangeBar) {
    rangeBar.addEventListener("input", function() {
      var multipliedValue = rangeBar.value * 2.55;
      var roundedValue = Math.ceil(multipliedValue);
      var roundedValueString = roundedValue.toString();
      turnOffFunctions(['0','1']) 
      vcWidgetSetValue2('4', roundedValueString, 'rangeBarPrezentacie');
    });
  }
});

document.addEventListener("DOMContentLoaded", function() {
  var rangeBar = document.getElementById("rangeBarStrop");
  if (rangeBar) {
    rangeBar.addEventListener("input", function() {
      var multipliedValue = rangeBar.value * 2.55;
      var roundedValue = Math.ceil(multipliedValue);
      var roundedValueString = roundedValue.toString();
      vcWidgetSetValue2('9', roundedValueString, 'rangeBarStrop');
    });
  }
});

function resetSliderSetFunctions(widgetId, onFunctionIds = [], offFunctionIds = []) {
  vcWidgetSetValue2(widgetId, "0");
  turnOnFunctions(onFunctionIds);
  turnOffFunctions(offFunctionIds);
}

function getRangebarStatus(widgetID, ranngeBarId) {
  // Fetch configuration data
  fetch('/static/config.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      var url = 'ws://' + data.qlcplusIP + '/qlcplusWS';
      var websocket = new WebSocket(url);

      // WebSocket open event handler
      websocket.addEventListener('open', function () {
        websocket.send('QLC+API|getWidgetStatus|' + widgetID);
      });

      // WebSocket message handler
      websocket.addEventListener('message', function (event) {
        var msgParams = event.data.split('|');
        if (msgParams[0] === "QLC+API" && msgParams[1] === "getWidgetStatus") {
          var status = msgParams[2];
          if (status === "PLAY") {
            status = status + "(Step: " + msgParams[3] + ")";
          }
          // Handle the status message
          var rangeBar = document.getElementById(ranngeBarId);
          if (rangeBar) {
            processedStatus = Math.ceil(status / 2.55);
            if (processedStatus < 10) {
              rangeBar.value = 0;
            } else {
              rangeBar.value = Math.ceil(status / 2.55);
              websocket.close()
            }
          }
        }
      });
    })
    .catch(error => {
      console.error('Error fetching configuration:', error);
    });
}

function getButtonStatus(widgetID, buttonID) {
  const button = document.querySelector('.' + buttonID);
  if (!button) {
    return;
  }

  // Fetch configuration data
  fetch('/static/config.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      var url = 'ws://' + data.qlcplusIP + '/qlcplusWS';
      var websocket = new WebSocket(url);

      // WebSocket open event handler
      websocket.addEventListener('open', function () {
        websocket.send('QLC+API|getWidgetStatus|' + widgetID);
      });

      // WebSocket message handler
      websocket.addEventListener('message', function (event) {
        var msgParams = event.data.split('|');
        if (msgParams[0] === "QLC+API" && msgParams[1] === "getWidgetStatus") {
          var status = msgParams[2];
          if (status === "PLAY") {
            status = status + "(Step: " + msgParams[3] + ")";
          }
          // Handle the status message
          if (status == 255) {
            const button = document.querySelector('.' + buttonID);
            button.classList.add('active');
            websocket.close();
        };
          
        websocket.close()
    }});
    })
    
};

function stopAllFunctions(except) {
  vcWidgetSetValue2("10", "255", undefined);
  vcWidgetSetValue2(except, "225", undefined);
}

function selectValue(value) {
  document.getElementById('qlcplusIPInput').value = value;
}

document.addEventListener("DOMContentLoaded", function() {
  var rangeBarRed = document.getElementById("rangeBarRed");
  if (rangeBarRed) {
    rangeBarRed.addEventListener("input", function() {
      var multipliedValue = rangeBarRed.value * 2.55;
      var roundedValue = Math.ceil(multipliedValue);
      var roundedValueString = roundedValue.toString();
      vcWidgetSetValue2('13', roundedValueString, 'rangeBarRed');
    });
  }

  var rangeBarGreen = document.getElementById("rangeBarGreen");
  if (rangeBarGreen) {
    rangeBarGreen.addEventListener("input", function() {
      var multipliedValue = rangeBarGreen.value * 2.55;
      var roundedValue = Math.ceil(multipliedValue);
      var roundedValueString = roundedValue.toString();
      vcWidgetSetValue2('11', roundedValueString, 'rangeBarGreen');
    });
  }

  var rangeBarBlue = document.getElementById("rangeBarBlue");
  if (rangeBarBlue) {
    rangeBarBlue.addEventListener("input", function() {
      var multipliedValue = rangeBarBlue.value * 2.55;
      var roundedValue = Math.ceil(multipliedValue);
      var roundedValueString = roundedValue.toString();
      vcWidgetSetValue2('12', roundedValueString, 'rangeBarBlue');
    });
  }
});

function turnOffSliders(sliderIds) {
  sliderIds.forEach(sliderId => vcWidgetSetValue2(sliderId, ''))
  }

function resolveRangeBar4(val) {
  val = Math.floor(val/2.55)
  document.getElementById('rangeBarPrezentacie').value = val
}