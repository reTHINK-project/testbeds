/** Public region **/

/** Region Variables **/

let hypertyConnector = null;
let hypertyToCall = null;
let messageSent = false;
let hypertyLoaded = false;
let isLoaded = false;

/** Region Constants **/
const hypertyURIC = (domain, hyperty) => `hyperty-catalogue://catalogue.${domain}/.well-known/hyperty/${hyperty}`;


/** Load an hyperty "Connector" for WebRTC Communication  **/
function loadHypertyConnector() {
  RUNTIME.requireHyperty(hypertyURIC(domain, 'Connector')).then((hyperty) => {
    isLoaded = true;
    console.log('hyperty', hyperty);
    var actionsPanel = $('.action-panel');
    hypertyConnector = hyperty;
    actionsPanel.append('<p><b>'
      + ' Event: Hyperty ' + hyperty.name + ' Deployed<br>' +
      '<hr style="border:1px solid;"/></b></p>');

    actionsPanel.animate({ scrollTop: $("#actiondown").offset().top }, 500);
    hypertyDeployed(hypertyConnector);
	displaySearch();
    //status++;
  });
}

/** Search for a user using Runtime capabilities and an hyperty */
function displaySearch()
{
	// Get user information
  var search = hypertyConnector.instance.search;
  var section = $('#discover');
  var searchForm = section.find('form');
  var inputField = searchForm.find('.friend-email');
  var inputDomain = searchForm.find('.input-domain');
  var inputHyperty = $('#input-hyperty');

  section.removeClass('hide');
  searchForm.off('submit');
  searchForm.on('submit', function(event) {
    event.preventDefault();

    var email = inputField.val();
    var domain = inputDomain.val();
	var hypertyAddress = inputHyperty.val();

/*	var collection = section.find('.collection');
	var collectionItem = '<li class="collection-item item-loader"><div class="preloader-wrapper small active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></li>';

	collection.empty();
	collection.removeClass('hide');
	collection.addClass('center-align');
	collection.prepend(collectionItem);
*/
	console.log('searching for: ', email, ' at domain: ', domain);

	search.users([email], [domain], ['connection'], ['audio', 'video']).then(emailDiscovered).catch(emailDiscoveredError);
  });	
  
  inputHyperty.focusout(function()
	{
		var hypURL = inputHyperty.val();
		hypertyConnector.instance.discovery.discoverHyperty(hypURL).then(function(result) {
			hypertyToCall = result;
			displayCallSection();
		});
	});
}


/** Add Eventlistener on hyperty actions **/
function hypertyDeployed(result) {
  
  // local hyperty variable
  let hypertyC;

  hypertyC = result.instance;
  
  // Here is the callback in case on invitation
  hypertyC.onInvitation(function(controller, identity) {
	console.log('On Invitation: ', controller, identity);
	notificationHandler(controller, identity);
  });  
  
  //////////////////////////////////////////////////
  // This part is just for display! 
  //  Just for display
  let logs = $('.call-to-action');
  console.log("hyperty Connector", hypertyC);
  logs.append("<div> hyperty Connector --> " + hypertyC + "</div>");
  logs.append("<div> hyperty Connector._domain --> " + hypertyC._domain + "</div>");
  logs.append("<div> hyperty Connector._objectDescURL --> " + hypertyC._objectDescURL + "</div><br>");
  $('.selection-panel').hide();
  var actionsPanel = $('.action-panel');
  actionsPanel.append('<p>The current Hyperty Connector URL is :' + result.runtimeHypertyURL + '</p>');
  actionsPanel.animate({ scrollTop: $("#actiondown").offset().top }, 500);

  var search = result.instance.search;
  search.myIdentity().then(function(identity) {
	  // Just for display
	  console.log("MY IDENTITY ", identity);
	  let $cardPanel = $('.action-panel');
	  let hypertyInfo = '<div class="row"><span class="white-text">' +
						'<b>Name:</b> ' + result.name + '</br>' +
						'<b>Status:</b> ' + result.status + '</br>' +
						'<b>HypertyURL:</b> ' + result.runtimeHypertyURL + '</br>' +
						'</span></div>';

	  let userInfo = '<div class="row"><span class="white-text">' +
					 '<span class="col s2">' +
					 '<img width="48" height="48" src="' + identity.avatar + '" alt="" class="circle">' +
					 '</span><span class="col s10">' +
					 '<b>Name:</b> ' + identity.cn + '</br>' +
					 '<b>Email:</b> ' + identity.username + '</br>' +
					 '<b>UserURL:</b> ' + identity.userURL +
					 '</span></div>';

	  $cardPanel.append(userInfo);
	  $cardPanel.append(hypertyInfo);
	  });
  
}


// Do something in case of error!
function emailDiscoveredError(result) {

  console.error('Email Discovered Error: ', result);
  console.log('Email Discovered Error: ', result);
}

function displayCallSection()
{
	// Allow to call the person!
	var callButton = $('#inputCall');
	callButton.text("Call " + hypertyToCall.userID);
	callButton.removeClass('hide');
	callButton.off('click');
	callButton.on('click', function(event) {
		event.preventDefault();
		let userURL = hypertyToCall.userID;
		let hypertyURL = hypertyToCall.hypertyID;

		let domain = hypertyURL.substring(hypertyURL.lastIndexOf(':') + 3, hypertyURL.lastIndexOf('/'));
		console.log('Domain:', domain);

		openVideo(userURL, domain);
	});
}

// Do something if someone was found
function emailDiscovered(result) {
  console.log('An Email is Discovered: ', result);
  
  var section = $('.action-panel');
  if (result.length === 0) {
    section.append("Nothing found !<br/>");
  }

  result.forEach((hyperty) => {
     if(!(typeof hyperty.hypertyID === "undefined")){
		section.append("userID : " + hyperty.userID + "<br/>");
		section.append("descriptor : " + hyperty.descriptor  + "<br/>");
		section.append("hypertyID : " + hyperty.hypertyID + "<br/>");
		section.append("resources: " + JSON.stringify(hyperty.resources) + "<br/>");
		hypertyToCall = hyperty;
		$('#input-hyperty').val(hyperty.hypertyID);
		displayCallSection();
	 }
  });
}


/**
* Video management
*/
function getUserMedia(constraints) {
  return new Promise(function(resolve, reject) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(mediaStream) {
        resolve(mediaStream);
      })
      .catch(function(reason) {
        reject(reason);
      });
  });
}

/**
* Try to open a video to join peer
*/
function openVideo(toUser, domain) {

  console.log('connecting hyperty: ', toUser);

  var localMediaStream;

  var options = options || {video: true, audio: true};
  getUserMedia(options).then(function(mediaStream) 
  {
    console.info('received media stream: ', mediaStream);
    localMediaStream = mediaStream;
    return hypertyConnector.instance.connect(toUser, mediaStream, '', domain);
  }).then(function(controller) {
    showVideo(controller);
    processLocalVideo(localMediaStream);
  }).catch(function(reason) {
    console.error(reason);
  });
}



///////////////////////////////
/**
* Incoming calls
*/
function notificationHandler(controller, identity) {

  var calleeInfo = identity;
  var incoming = $('#AcceptCall');
  var acceptBtn = incoming.find('.btn-accept');
  var rejectBtn = incoming.find('.btn-reject');

  var informationHolder = incoming.find('.information');

  // Acceptation
  acceptBtn.on('click', function(e) {

	showVideo(controller);
    console.log('accepted call from', calleeInfo);
	
	incoming.removeClass('show');
	incoming.addClass('hide');

    e.preventDefault();

    var options = options || {video: true, audio: true};
    getUserMedia(options).then(function(mediaStream) {
      processLocalVideo(mediaStream);
      return controller.accept(mediaStream);
    })
    .then(function(result) {
      console.log(result);
    }).catch(function(reason) {
	  hideVideo();
      console.error(reason);
    });
	acceptBtn.off('click');
  });

  // Rejection
  rejectBtn.on('click', function(e) {

	incoming.removeClass('show');
	incoming.addClass('hide');
    controller.decline().then(function(result) {
      console.log(result);
    }).catch(function(reason) {
      console.error(reason);
    });
	rejectBtn.off('click');
    e.preventDefault();
  });

  var img = informationHolder.find('#avatar');
  img.attr("src", calleeInfo.avatar);
  var txt = informationHolder.find('#calleeName');
  txt.text(calleeInfo.cn);
  var txt = informationHolder.find('#calleeUsername');
  txt.text(calleeInfo.username);
  var txt = informationHolder.find('#calleLocale');
  txt.text(calleeInfo.locale);
  var txt = informationHolder.find('#calleUserURL');
  txt.text(calleeInfo.userURL);

  incoming.removeClass('hide');
  incoming.addClass('show');

}


/**
*
*/
function hideVideo()
{
  var videoHolder = $('#video');
  videoHolder.addClass('hide');
}
/**
* Display the video
*/

function showVideo(controller) {
  var videoHolder = $('#video');
  videoHolder.removeClass('hide');

  var btnCamera = videoHolder.find('.camera');
  var btnMute = videoHolder.find('.mute');
  var btnMic = videoHolder.find('.mic');
  var btnHangout = videoHolder.find('.hangout');

  console.log(controller);

  controller.onAddStream(function(event) {
    processVideo(event);
  });

  controller.onDisconnect(function(identity) {
	hideVideo();
    disconnecting();
  });

  btnCamera.off('click');
  btnCamera.on('click', function(event) {

    event.preventDefault();

    controller.disableVideo().then(function(status) {
      console.log(status, 'camera');
      var icon = 'videocam_off';
      var text = 'Disable Camera';
      if (!status) {
        text = 'Enable Camera';
        icon = 'videocam';
      }

      var iconEl = '<i class="material-icons left">' + icon + '</i>';
      $(event.currentTarget).html(iconEl);
    }).catch(function(e) {
      console.error(e);
    });

  });

  btnMute.off('click');
  btnMute.on('click', function(event) {

    event.preventDefault();

    controller.mute().then(function(status) {
      console.log(status, 'audio');
      var icon = 'volume_off';
      var text = 'Disable Sound';
      if (!status) {
        text = 'Enable Sound';
        icon = 'volume_up';
      }

      var iconEl = '<i class="material-icons left">' + icon + '</i>';
      $(event.currentTarget).html(iconEl);
    }).catch(function(e) {
      console.error(e);
    });

    console.log('mute other peer');

  });

  btnMic.off('click');
  btnMic.on('click', function(event) {

    event.preventDefault();

    controller.disableAudio().then(function(status) {
      console.log(status, 'mic');
      var icon = 'mic_off';
      var text = 'Disable Microphone';
      if (!status) {
        icon = 'mic';
        text = 'Enable Microphone';
      }

      var iconEl = '<i class="material-icons left">' + icon + '</i>';
      $(event.currentTarget).html(iconEl);
    }).catch(function(e) {
      console.error(e);
    });

  });

  btnHangout.on('click', function(event) {

    event.preventDefault();

    controller.disconnect().then(function(status) {
      console.log('Status of Handout:', status);
	  btnHangout.off('click');
      hideVideo();
	  disconnecting();
    }).catch(function(e) {
      console.error(e);
    });

    console.log('hangout');
  });
}

/**
* Display videos
*/

function processVideo(event) {

  console.log('Process Video: ', event);

  var videoHolder = $('.video-holder');
  var video = videoHolder.find('.video');
  video[0].src = URL.createObjectURL(event.stream);

}


function processLocalVideo(mediaStream) {
  console.log('Process Local Video: ', mediaStream);

  var videoHolder = $('#video');
  var video = videoHolder.find('.my-video');
  video[0].src = URL.createObjectURL(mediaStream);
}

function disconnecting() {

  var videoHolder = $('#video');
  var myVideo = videoHolder.find('.my-video');
  var video = videoHolder.find('.video');
  myVideo[0].src = '';
  video[0].src = '';

  videoHolder.addClass('hide');
}
