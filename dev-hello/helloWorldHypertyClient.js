/*
 * This file loads the Hyperty deployed on the catalogue 
 *
 *
 */

"use strict";
var RUNTIME;

let domain = 'powercommunication.rethink.orange-labs.fr';
let hypertyObserver = null;
let hypertyReporter = null;

const hypertyURI = (domain, hyperty) => `hyperty-catalogue://catalogue.${domain}/.well-known/hyperty/${hyperty}`;
/**
 * Loads Hyperty Runtime
 */
function loadRuntime()
{
     var start = new Date().getTime();
    //Rethink runtime is included in index.html
	rethink.default.install({
        domain: domain,
        development: false
    })
    .then((runtime) => {
        RUNTIME = runtime
	var time = (new Date().getTime()) - start;
        $('.runtime-panel').append('<p>Runtime has been successfully launched in ' + time/1000 +' seconds</p>' )
    })
}

function loadHypertyObs()
{
    RUNTIME.requireHyperty(hypertyURI(domain, 'HelloWorldObserver'))
    .then((hyperty) => {
      hypertyObserver = hyperty;
      $('.runtime-panel').append('<p>Hyperty '+hyperty.name+' is ON</p>')
      hypertyDeployed(hypertyObserver)
  });
}

function loadHypertyRep(){
    RUNTIME.requireHyperty(hypertyURI(domain, 'HelloWorldReporter'))
    .then((hyperty) => {
      hypertyReporter = hyperty;
      console.log(hyperty)
      $('.runtime-panel').append('<p>Hyperty '+hyperty.name+' is ON</p>')
      //hypertyDeployed(hypertyObserver)

    });
}

function sayHelloToHyperty()
{
  hypertyReporter.instance.hello(hypertyObserver.runtimeHypertyURL)
  .catch(function(reason) {
    console.error(reason);
  });

}

/**
  * Call back after hyperty is loaded
  */
function hypertyDeployed(result) {

  let hypertyObserver;

  hypertyObserver = result.instance;

  console.log(hypertyObserver);

  $('.selection-panel').hide();

  let hypertyPanel = $('.hyperty-panel');

  // displays the Hyperty URL
  let hi = '<p>Hyperty Observer URL: ' + result.runtimeHypertyURL + '</p>';
  hypertyPanel.append(hi);

  // Add an invitation Callback
  hypertyObserver.addEventListener('invitation', function(identity) {

    JSON.stringify(identity);

    console.log('Hello event received from:', identity);

    let invitationPanel = $('.invitation-panel');

    let invitation = `<p> Invitation received from:\n ` + identity.name + '</p>';

    invitationPanel.append(invitation);

  });


  hypertyObserver.addEventListener('hello', function(event) {

    console.log('Hello event received:', event);

    let msgPanel = $('.msg-panel');

    let msg = `<p>  ` + event.hello + `</p>`;

    msgPanel.append(msg);

  });

  console.log('Observer Waiting for Hello!!');

}
