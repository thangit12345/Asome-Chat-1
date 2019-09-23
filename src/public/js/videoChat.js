function videoChat(divId) {
  $(`#video-chat-${divId}`).unbind("click").on("click", function() {
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();

    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    };
    // step 01 of caller
    socket.emit("caller-check-listener-online-or-not", dataToEmit);
    

  });
  
}

function playVideoStream(videoTargetId, stream) {
  let video = document.getElementById(videoTargetId);
  video.srcObject = stream;
  video.onloadeddata = function() {
    video.play();
  };
}

function closeVideoStream(stream) {
  return stream.getTracks().forEach(track => track.stop());
}
$(document).ready(function() {
  // Step 02 of caller
  socket.on("server-send-listener-is-offline", function() {
    alertify.notify("Nguoi dung hien khong truc tuyens", "error", 7);
  });

  let iceServerList = $("#ice-server-list").val();
  //console.log(iceServerList);

  let getPeerId = "";
  const peer = new Peer({
    key: "peerjs",
    host: "peerjs-server-trungquandev.herokuapp.com",
    secure: true,
    port: 443,
    config: {"iceServers": JSON.parse(iceServerList)}, // config cho 2 thang chat video khac duong mang khac nhau
    debug: 3
  }); //cai nay co thu vien import trong file master
  //console.log(peer);
  peer.on("open", function(peerId) {
    getPeerId = peerId;
    console.log("peerId: ",getPeerId);
  });
  // step 03 of listener
  socket.on("server-request-peer-id-of-listener", function(response) {
    let listenerName = $("#navbar-username").text();;
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenerPeerId: getPeerId
    };
    // step 04 of listener
    socket.emit("listener-emit-peer-id-to-server", dataToEmit);
    
  });

  let timerInterval;
  // step 05 of caller
  socket.on("server-send-peer-id-of-listener-to-caller", function(response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName:response.listenerName,
      listenerPeerId: response.listenerPeerId
    };

    // step 06 of caller
    socket.emit("caller-request-call-to-server", dataToEmit);

      Swal.fire({
        title: `Dang goi cho &nbsp; <span style="color: #2ECC71;">${response.listenerName }</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
        html: `Thời gian : <strong style="color: #d43f3a;" ></strong> giay. <br/><br/>
        <button id="btn-cancel-call" class="btn btn-danger">
          Huy cuoc goi
        </button>
        `,
        backdrop: "rgba(85, 85, 85, 0.4)",
        width: "52rem",
        allowOutsideClick: false,
        timer: 30000, // 30 second
        onBeforeOpen: () => {
          $("#btn-cancel-call").unbind("click").on("click", function() {
            Swal.close();
            clearInterval(timerInterval);

            // step 07 of caller
            socket.emit("caller-cancel-request-call-to-server", dataToEmit);
          });
          if( Swal.getContent().querySelector !== null) {
            Swal.showLoading();
            timerInterval = setInterval(() => {
              Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            }, 1000);
          }
        },
        onOpen: () => {
          // step 12 of caller
          socket.on("server-send--reject-call-to-caller", function(response) {
            Swal.close();
            clearInterval(timerInterval);

            Swal.fire({
              type: "info",
              title: `<span style="color: #2ECC71;">${response.listenerName }</span> &nbsp; Hien tai khong the nge may`,
              backdrop: "rgba(85, 85, 85, 0.4)",
              width: "52rem",
              allowOutsideClick: false,
              confirmButtonColor: "#2ECC71",
              confirmButtonText: "Xác nhận",
            });
          });

        },
        onClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        return false;
      });
    
  });

  // step 08 of listener
  socket.on("server-send-request-call-to-listener", function(response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName:response.listenerName,
      listenerPeerId: response.listenerPeerId
    };
    console.log("step08: ", dataToEmit);

  
      Swal.fire({
        title: `<span style="color: #2ECC71;">${response.callerName }</span> &nbsp; muon tro chuyen video voi ban <i class="fa fa-volume-control-phone"></i>`,
        html: `Thời gian : <strong style="color: #d43f3a;" ></strong> giay. <br/><br/>
        <button id="btn-reject-call" class="btn btn-danger">
          Tu choi
        </button>
        <button id="btn-accept-call" class="btn btn-success">
          Dong y
        </button>
        `,
        backdrop: "rgba(85, 85, 85, 0.4)",
        width: "52rem",
        allowOutsideClick: false,
        timer: 30000, // 30 second
        onBeforeOpen: () => {
          $("#btn-reject-call").unbind("click").on("click", function() {
            Swal.close();
            clearInterval(timerInterval);

            // step 10 of lisetener
            socket.emit("listener-reject-request-call-to-server", dataToEmit);
          });

          $("#btn-accept-call").unbind("click").on("click", function() {
            Swal.close();
            clearInterval(timerInterval);

            // step 11 of lisetener
            socket.emit("listener-accept-request-call-to-server", dataToEmit);
          });

          if( Swal.getContent().querySelector !== null) {
            Swal.showLoading();
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
          }
        },
        onOpen: () => {
          // step 09 of listener
          socket.on("server-send-cancel-request-call-to-listener", function(response) {
            Swal.close();
            clearInterval(timerInterval);
          });
        },
        onClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        return false;
      });
  });
  // step 13 of caller
  socket.on("server-send-accept-call-to-caller", function(response) {
    console.log("resposeid", response.listenerPeerId);
    Swal.close();
    clearInterval(timerInterval);

    // console.log("Caller okkkkk!"); ..len trang peerjs.com copy past
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    getUserMedia({video: true, audio: true}, function(stream) {
      // show modal streaming
      $("#streamModal").modal("show");

      //play my stream in local (of calller)
      playVideoStream("local-stream", stream);

      // call to listener
      let call = peer.call(response.listenerPeerId, stream);
      //listen and play stream of listener
      call.on("stream", function(remoteStream) {
        //play stream of listener
        playVideoStream("remote-stream", remoteStream);
      });

      // close modal : remove stream 
      $("#streamModal").on("hidden.bs.modal", function() {
        closeVideoStream(stream);
        Swal.fire({
          type: "info",
          title: `Da ket thuc cuoc goi voi &nbsp; <span style="color: #2ECC71;">${response.listenerName }</span> &nbsp; `,
          backdrop: "rgba(85, 85, 85, 0.4)",
          width: "52rem",
          allowOutsideClick: false,
          confirmButtonColor: "#2ECC71",
          confirmButtonText: "Xác nhận",
        });
      });
    }, function(err) {
      console.log("Failed to get local stream" ,err.toString());
      if(error.toString() === "NotAllowedError: Permission denide") {
        alertify.notify("Xin loi ban da tat quuyen truy cap vao thiet bi nge goi tren trinh chuyen..vui long moi lai phan cai dat trong trinh duyet", "error", 7);
      }
      if(error.toString() === "NotFoundError: Requested device not found") {
        alertify.notify("Xin loi chung toi khong tim thay thiet bi nge goi tren may tinh cua ban ", "error", 7);
      }
    });

  });

   // step 14 of listener
   socket.on("server-send-accept-call-to-listener", function(response) {
    Swal.close();
    clearInterval(timerInterval);

    // console.log("listener okkkkk!");
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    peer.on("call", function(call) {
      getUserMedia({video: true, audio: true}, function(stream) {
        $("#streamModal").modal("show");

        //play my stream in local (of listener)
        playVideoStream("local-stream", stream);

        call.answer(stream); // Answer the call with an A/V stream.

        call.on("stream", function(remoteStream) {
          //play stream of caller
          playVideoStream("remote-stream", remoteStream);
        });

      // close modal : remove stream 
      $("#streamModal").on("hidden.bs.modal", function() {
        closeVideoStream(stream);
        Swal.fire({
          type: "info",
          title: `Da ket thuc cuoc goi voi &nbsp; <span style="color: #2ECC71;">${response.callerName }</span> &nbsp; `,
          backdrop: "rgba(85, 85, 85, 0.4)",
          width: "52rem",
          allowOutsideClick: false,
          confirmButtonColor: "#2ECC71",
          confirmButtonText: "Xác nhận",
        });
      });
      }, function(err) {
        console.log("Failed to get local stream" ,err.toString());
        if(error.toString() === "NotAllowedError: Permission denide") {
          alertify.notify("Xin loi ban da tat quuyen truy cap vao thiet bi nge goi tren trinh chuyen..vui long moi lai phan cai dat trong trinh duyet", "error", 7);
        }
        if(error.toString() === "NotFoundError: Requested device not found") {
          alertify.notify("Xin loi chung toi khong tim thay thiet bi nge goi tren may tinh cua ban ", "error", 7);
        }
      });
    });
  });
});