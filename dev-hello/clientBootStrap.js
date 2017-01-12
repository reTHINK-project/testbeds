/**
* This is the very first bootstrap for rethink. It allows only to load the rethink runtime.
*
*/

/** Public region **/

/** TODO --> Chix du domain via input **/
let domain;
let bootStrapDomain = "call.rethink.orange-labs.fr";

/** Region Variables **/

let RUNTIME;
let runtimeURL;


/** Load Hyperty Runtime **/
$(document).ready(function () {
  askDomain();
  //loadRuntime();
});

// waits for the rethink.js to be loaded.
function checkLoading()
{
   if(typeof rethink === "undefined"){
	setTimeout(function(){
		checkLoading();
	},250);
    } else {
		doLoading();
	}
}

// Loads the runtime.
function doLoading(){
  var start = new Date().getTime();
   rethink.default.install({
    domain: domain,
    development: false,
    runtimeURL: runtimeURL
  }).then((runtime) => {
    RUNTIME = runtime
    var time = (new Date().getTime()) - start;
    var logs = $('.call-to-action');
    logs.append('<span>Runtime has been successfully launched in ' + time / 1000 + ' seconds</sapn>');
  });
}
/** Load Runtme reThink **/
function loadRuntime() {
  //Rethink runtime is included in index.html
  checkLoading();
}

function removeModal(modalToClose) {
  modalToClose.removeClass('show');
}

// evenement qui appelle la fonction removeModal()
function removeModalHandler() {
  var modal = $('#popup');
  removeModal(modal);
}


function askDomain() {
  var modal = $('#popup');
  var close = $('.close');
  modal.addClass('show');

  close.click(function (event) {
    event.stopPropagation();
    removeModalHandler();
  });

}

function registerDomain() {
  var currentDomain = $("#domainUri").val();
  if (currentDomain != "") {
    domain = currentDomain;
    bootStrapDomain = currentDomain;
    var my_awesome_script = document.createElement('script');
    my_awesome_script.setAttribute('src',`https://${bootStrapDomain}/.well-known/runtime/rethink.js`);
    document.head.appendChild(my_awesome_script);

    runtimeURL = `hyperty-catalogue://catalogue.${domain}/.well-known/runtime/Runtime`; 
    removeModalHandler();
    loadRuntime();
  }
  else {
    $(".need").show();
  }
}



