/** Public region **/
let STATUS_DISCONNECTED;
let STATUS_CONNECTED;

/** Region Variables **/

let hypertyWebRTC = null;
let hypertyToCall = null;
let messageSent = false;
let HYPERTY_NAME = "DTWebRTC";
let isLoaded = false;
let status = STATUS_DISCONNECTED;

/** Region Constants **/
const hypertyURIC = (domain, hyperty) => `hyperty-catalogue://catalogue.${domain}/.well-known/hyperty/${hyperty}`;


/** Load an hyperty "Connector" for WebRTC Communication  **/
function loadHypertyConnector() {
  STATUS_DISCONNECTED = 0;
  STATUS_CONNECTED = 1;
  RUNTIME.requireHyperty(hypertyURIC(domain, HYPERTY_NAME)).then((hyperty) => {
    isLoaded = true;
    console.log('hyperty', hyperty);
    var actionsPanel = $('.action-panel');
    hypertyWebRTC = hyperty.instance;
    actionsPanel.append('<p><b>'
      + ' Event: Hyperty ' + hyperty.name + ' Deployed<br>' +
      '<hr style="border:1px solid;"/></b></p>');

    actionsPanel.animate({ scrollTop: $("#actiondown").offset().top }, 500);
    hypertyLoaded(hyperty);
	displaySearch();
    //status++;
  });
}



function toggleSettings(event) {
	event.preventDefault();
    $("#settings").toggle();
}


/** Add Eventlistener on hyperty actions **/
function hypertyLoaded(result) {
  STATUS_DISCONNECTED = 0;
  STATUS_CONNECTED = 1;
  status = STATUS_DISCONNECTED;
 

 // Initialize interface buttons
  $('#hangup').on('click', hangup);
  $('#settings').on('submit', saveProfile);
  $('#settings').on('submit', toggleSettings);

  $('#local-audio').on('click', () => {
    // let the hyperty switch stream-tracks
    hypertyWebRTC.switchLocalAudio( $('#local-audio').is(":checked") )
  });
  $('#local-video').on('click', () => {
    // let the hyperty switch stream-tracks
    hypertyWebRTC.switchLocalVideo( $('#local-video').is(":checked") )
  });

  $('#remote-audio').on('click', () => {
    console.log('[DTWebRTC] --> setting remote audio to: ' + $('#remote-audio').is(":checked"));
    let rv = document.getElementById('remoteVideo');
    rv.muted = $('#remote-audio').is(":checked");
  })
  ;
  $('#remote-video').on('click', () => {
    console.log('[DTWebRTC] --> setting remote video to: ' + $('#remote-video').is(":checked"));
    let rv = document.getElementById('remoteVideo');
    if ($('#remote-video').is(":checked"))
       rv.play();
    else
      rv.pause();
  });

  
  
  // local hyperty variable
  let hypertyC;

  hypertyC = result.instance;
  hypertyC.myUrl = result.runtimeHypertyURL;
   
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
  //////
  
   // get registered user to display
   hypertyC.search.myIdentity().then(function(identity) {
		console.log("[DTWebRTC.main]: registered user is: ", identity);
		hypertyC.myIdentity = identity;
   	    let $cardPanel = $('.action-panel');
		
		let info = "Authenticated as:</br>" + identity.cn + ",  " + identity.username + '<img  width="48" height="48" src="' + hypertyC.myIdentity.avatar + '" class="circle" /></br>' +
					"Hyperty URL:</br>" + result.runtimeHypertyURL;
		  $cardPanel.append(info);
		}).catch((reason) => {
			console.log("[DTWebRTC.main]: error while discovery of registered user. Error is ", reason);
			$cardPanel.append('<p>Hyperty URL:   ' + result.runtimeHypertyURL + '</p>');
		});
	
	// Here we initialize the behaviour of the hyperty
	initListeners();
    $.getScript("adapter.js");

}

// This fills the window displayed when an incoming call arrives
function fillmodal(calleeInfo) {
  let picture = calleeInfo.infoToken ? calleeInfo.infoToken.picture : calleeInfo.userProfile ? calleeInfo.userProfile.avatar : "";
  let name = calleeInfo.infoToken ? calleeInfo.infoToken.name : calleeInfo.userProfile ? calleeInfo.userProfile.cn : "";
  let email = calleeInfo.infoToken ? calleeInfo.infoToken.email : calleeInfo.userProfile ? calleeInfo.userProfile.username : "";
  let locale = calleeInfo.infoToken ? calleeInfo.infoToken.locale : calleeInfo.userProfile ? calleeInfo.userProfile.locale : "";
  $('#modalinfo').html(
    '<div class="container-fluid"><div class="row"><div class="col-sm-2 avatar"><img  width="48" height="48" src="' + picture + '" ></div>' +
    '<div class="col-sm-9 col-sm-offset-1"><div><span class=" black-text">Name: ' + name + '</span></div><div><span class=" black-text">Email: ' + email + '</span></div><div><span class=" black-text">Ort: ' + locale + '</span></div>' +
    '</div></div></div>');
}


// This method defines the behaviour of the Hyperty for the main events : call and hangup, video srteams.
function initListeners() {
  // Incoming call....
  hypertyWebRTC.addEventListener('incomingcall', (identity) => {
	// preparing the modal dialog with the given identity info
    console.log('incomingcall event received from:', identity);
    $('.invitation-panel').html('<p> Invitation received from:\n ' + identity.email ? identity.email : identity.username + '</p>');
    fillmodal(identity);
    prepareMediaOptions();

 	var calleeInfo = identity;
	var incoming = $('#AcceptCall');
	incoming.removeClass('hide');
	incoming.addClass('show');
	
    $('.invitation-panel').html('<p> Invitation received from:\n ' + identity.email ? identity.email : identity.username + '</p>');
    fillmodal(identity);
    prepareMediaOptions();

    $('#AcceptCall').find('#btn-accept').on('click', () => {
      hypertyWebRTC.acceptCall();
    });
    $('#AcceptCall').find('#btn-reject').on('click', () => {
      hangup();
    });
    $('#AcceptCall').modal('show');
  });
  // End Incoming call....

  // disconnect
  hypertyWebRTC.addEventListener('disconnected', () => {
    console.log('>>>disconnected');
    $('.send-panel').removeClass('hide');
    $('.webrtcconnect').empty();
    $('.invitation-panel').empty();
    $('#AcceptCall').modal('hide');
    let rv = document.getElementById('remoteVideo');
    let lv = document.getElementById('localVideo');
    $('#localVideo').removeClass('smallVideo').addClass('fullVideo');
    $('#remoteVideo').removeClass('fullVideo').addClass('smallVideo');
    rv.src = "";
    lv.src = "";

    $('#info').removeClass('hide');
    $('#video').removeClass('show').addClass('hide');
    $('#discover').removeClass('hide');
  });
  // End disconnect
  
  // display local video
  hypertyWebRTC.addEventListener('localvideo', (stream) => {
    console.log('local stream received');
    document.getElementById('localVideo').srcObject = stream;
  });
  // End display

  // display remote video
  hypertyWebRTC.addEventListener('remotevideo', (stream) => {
    $('#info').addClass('hide');
	$('#video').addClass('show');
	$('#video').removeClass('hide');
    let rv = document.getElementById('remoteVideo');
    let lv = document.getElementById('localVideo');
    rv.srcObject = stream;
    $('#remoteVideo').removeClass('smallVideo').addClass('fullVideo');
    $('#localVideo').removeClass('fullVideo').addClass('smallVideo');
    console.log('remotevideo received');
    $('.invitation-panel').empty();
    status = STATUS_CONNECTED;
  });
  // End display
}

/** Search for a user using Runtime capabilities and an hyperty */
function displaySearch()
{
	// Get user information
	var section = $('#discover');
	var searchForm = section.find('form');
	var inputField = searchForm.find('.friend-email');
	var inputDomain = searchForm.find('.input-domain');

	section.removeClass('hide');
	searchForm.off('submit');

	// Define the search function.
	searchForm.on('submit', function(event) {
		event.preventDefault();
		var email = inputField.val();
		var domain = inputDomain.val();
		console.log('searching for: ', email, ' at domain: ', domain);

		hypertyWebRTC.search.users([email], [domain], ['connection'], ['audio','video']).then( (result) => {
			console.log('An Email is Discovered: ', result);
			  
			var actionsPanel = $('.action-panel');
			hypertyToCall = result[0];
			actionsPanel.append("userID : " + hypertyToCall.userID + "<br/>");
			actionsPanel.append("descriptor : " + hypertyToCall.descriptor  + "<br/>");
			actionsPanel.append("hypertyID : " + hypertyToCall.hypertyID + "<br/>");
			actionsPanel.animate({ scrollTop: $("#actiondown").offset().top }, 500);
			$('#input-hyperty').val(hypertyToCall.hypertyID);
			displayCallSection(result[0].hypertyID);
		}).catch((err) => {
			$('.send-panel').html(
				'<div>No hyperty found!</div>'
			  );
			console.error('Email Discovered Error: ', err);
			console.log('Email Discovered Error: ', err);
		});

	});	
	///////searchForm.on
  
    // In case an Hyperty URL is entered we allow to call.
    var inputHyperty = $('#input-hyperty');
    inputHyperty.focusout(function()
	{
		var hypURL = inputHyperty.val();
		if (hypURL != "")
		{
			displayCallSection(hypURL);
		}
	});
}

// This displays the Call button if a search was successfull or if an hyperty URL was entered.
// Even if a search was processed we only use the Hyperty URL to place the call (what is entered in the Input).
function displayCallSection()
{
	// Allow to call the person!
	var callButton = $('#inputCall');
	if (hypertyToCall != undefined)
	{
		callButton.text("Call " + hypertyToCall.userID);
	}
	else
	{
		callButton.text("Call ");
	}
	// Shows the Call button
	callButton.removeClass('hide');
	callButton.off('click');
	// Call process
	callButton.on('click', function(event) {
		event.preventDefault();

		// Retreive the Called URL
		let toHyperty = $('#input-hyperty').val();
	    $('#discover').addClass('hide');
		
		saveProfile(event);
		getIceServers();
		prepareMediaOptions();
        status = STATUS_DISCONNECTED;
		// This is to display a  "wait"
		let connect_html = '<center><br><i style="color: #e20074;" class="center fa fa-cog fa-spin fa-5x fa-fw"></i></center><p>wait for answer...</p>';
		$('.invitation-panel').html(connect_html);

		setTimeout( () => {
		if ( status == STATUS_DISCONNECTED ) {
		  $('.invitation-panel').append( '<button id="cancel"  class="btn btn-default btn-sm ">Cancel</button>' );
		  $('#cancel').on('click', hangup );
		}
		}, 6000);
		   
		console.log(toHyperty);
		// Try to connect (this launch the local media event)
		hypertyWebRTC.connect(toHyperty).then((obj) => {
				  console.log('Webrtc obj: ', obj);
				})
				.catch(function(reason) {
				  console.error(reason);
				  $('#discover').removeClass('hide');
				});
		});
}


// Hang up of the communication
function hangup() {
  hypertyWebRTC.disconnect();
}

// ###################################################################################################################
// ################################## Profile-Settings ###################################################################
// ###################################################################################################################

var PROFILE_KEY = "WEBRTC-SIMPLE-SETTINGS";

function getIceServers() {
  var stun = $("#stun").val();
  var turn = $("#turn").val();
  var turn_user = $("#turn_user").val();
  var turn_pass = $("#turn_pass").val();
  var mode = $("#strictice").is(':checked') ? "strictice" : null;
  console.log('[DTWebRTC] IceServer mode:', mode);
  var iceServers = [];
  if (!turn || !turn_user || !turn_pass) {
    turn = "";
    turn_user = "";
    turn_pass = "";
  }
  if (stun)
    iceServers.push({
      urls: "stun:" + stun
    });
  if (turn)
    iceServers.push({
      urls: "turn:" + turn,
      username: turn_user,
      credential: turn_pass
    });
  hypertyWebRTC.setIceServer(iceServers, mode);

}

function saveProfile(event) {
  event.preventDefault();
  var profile = {};
  console.log("[DTWebRTC.main]:save profile " + PROFILE_KEY);
  // transfer all values from all text-inputs of the settings div to profile
  $("#settings :text").each(function(i) {
    profile[$(this).attr('id')] = $(this).val();
  });
  $("#settings  :password").each(function(i) {
    profile[$(this).attr('id')] = $(this).val();
  });
  $("#settings :checkbox").each(function(i) {
    profile[$(this).attr('id')] = $(this).is(':checked');
  });
  $("#settings #camResolution").each(function(i) {
    profile[$(this).attr('id')] = $(this).val();
  });

  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function loadProfile() {
  console.log("[DTWebRTC.main]:loading profile " + PROFILE_KEY);
  var profile = null;
  var s = localStorage.getItem(PROFILE_KEY);
  if (s) {
    try {
      profile = JSON.parse(s);
    } catch (e) {
      console.log("[DTWebRTC.main]:error while parsing settings from local storage");
    }
  }
  if (profile !== null) {
    var target;
    for (var key in profile) {
      target = $("#settings #" + key);
      if (target[0]) {
        target.attr('type') != "checkbox" ? target.val(profile[key]) : target.attr('checked', profile[key]);
      }
    }
  }
}


function prepareMediaOptions() {
  var mediaOptions = {
    'audio': true,
    'video': true
  };
  hypertyWebRTC.setMediaOptions(mediaOptions);
}

