/*
 * This file loads the Hyperty deployed on the catalogue 
 *
 *
 */

"use strict";

/**
 * Loads Hyperty Runtime
 */
function loadRuntime()
{
	// Here we should insert the content for getting Runtime from the catalogue
	System.import("./core");
	console.log("runtime loaded");
}

function loadHyperty()
{
	
}

function sayHelloToHyperty()
{

}

		

/**
 * Loads the Hyperty from the catalogue
 */
function deployHyperty(runtimeLoader) {

    let hypertyHolder = $('.hyperties');
    hypertyHolder.removeClass('hide');

    console.log(runtimeLoader);

    let hypertyObserver = 'hyperty-catalogue://' + runtime.domain + '/.well-known/hyperty/HelloWorld';

    // Load First Hyperty
    runtimeLoader.requireHyperty(hypertyObserver).then(hypertyDeployed).catch(function(reason) {
    errorMessage(reason);
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



Handlebars.getTemplate = function(name) {

  return new Promise(function(resolve, reject) {

    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
      Handlebars.templates = {};
    } else {
      resolve(Handlebars.templates[name]);
    }

    $.ajax({
      url: 'templates/' + name + '.hbs',
      success: function(data) {
        Handlebars.templates[name] = Handlebars.compile(data);
        resolve(Handlebars.templates[name]);
      },

      fail: function(reason) {
        reject(reason);
      }
    });

  });

}
