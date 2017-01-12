/** Public region **/

//let domain = 'csp.rethink3.orange-labs.fr';
/** TODO --> Chix du domain via input **/
//let domain;

/** Region Variables **/

//let RUNTIME;
let hypertyObserver = null;
let hypertyReporter = null;
//let runtimeURL;
let toHyperty = null;
let status = 0;
let sent = false;
let reporterLoaded = false;
let firstContactRemote = true;
let isLoad = { reporterIsLoad: false, observerIsLoad: false };

//var logs = $('.call-to-action');
//var actionsPanel = $('.runtime-panel');

/** Region Constants **/
const hypertyURI = (domain, hyperty) => `hyperty-catalogue://catalogue.${domain}/.well-known/hyperty/${hyperty}`;

/** Load an hyperty "HelloWorld" Observer  **/
function loadHypertyObs() {
  RUNTIME.requireHyperty(hypertyURI(domain, 'HelloWorldObserver')).then((hyperty) => {
    isLoad.observerIsLoad = true;
    console.log('hyperty', hyperty);
    var actionsPanel = $('.action-panel');
    hypertyObserver = hyperty;
    actionsPanel.append('<p><b>'
      + ' Event: Hyperty ' + hyperty.name + ' Deployed<br>' +
      '<hr style="border:1px solid;"/></b></p>');

    actionsPanel.animate({ scrollTop: $("#actiondown").offset().top }, 500);
    hypertyDeployed(hypertyObserver);
    //status++;
    enableSayHelloToLocal();
  });
}

/** Load an hyperty "HelloWorld" Reporter  **/
function loadHypertyRep() {
  RUNTIME.requireHyperty(hypertyURI(domain, 'HelloWorldReporter')).then((hyperty) => {
    hypertyReporter = hyperty;
    console.log(hyperty);
    var actionsPanel = $('.action-panel');
    actionsPanel.append('<p><b>'
      + ' Event: Hyperty ' + hyperty.name + ' Deployed<br>' +
      '<hr style="border:1px solid;"/></b></p>');
    actionsPanel.animate({ scrollTop: $("#actiondown").offset().top }, 500);
    if (!reporterLoaded) {
      let collection = $('.collection');
      collection.append('<li><button onclick="fillSayHelloToRemoteHyperty();" class="collection-item">How to say Hello to a remote Hyperty</button></li>');
      reporterLoaded = true;
    }
    enableSayHelloToLocal();
    isLoad.reporterIsLoad = true;
  });
}

/** Sent a "hello" message to local hyperty **/
function sayHelloToLocalHyperty() {
  if (checkLoad()) {
    console.log('Saying Hello');
    hypertyReporter.instance.hello(hypertyObserver.runtimeHypertyURL).then(function (helloObject) {
      toHyperty = hypertyObserver.runtimeHypertyURL;
      var actionsPanel = $('.action-panel');
      actionsPanel.append('<p><b>'
        + ' Event: Hello sent to Local Hypperty <br>' +
        '<hr style="border:1px solid;"/></b></p>');
      actionsPanel.animate({ scrollTop: $("#actiondown").offset().top }, 500);
      $('.runtime-panel').append('<p>Observer Url to send Hello: ' + toHyperty + '</p>');
      if (!sent) {
        let collection = $('.collection');
        collection.append('<li><button onclick="sayByeToHyperty();"  class="collection-item">How to say bye to Observer Hyperty</button></li>');
        sent = true;
      }
    }).catch(function (reason) {
      console.error(reason);
    });
  }
}

/** Add a input text box to enter url from another hyperty **/
function fillSayHelloToRemoteHyperty() {
  if (checkLoad()) {
    let hello = $('.action-panel');
    //if (firstContactRemote) {
      let sayHelloTo = '<form class="say-hello"><div> Hyperty URL: <input class="urlInput" type="text" name="toHyperty" placeholder="Past here one url of another Hyperty "helloWorld""><br><input style="margin-top: 5px;" class="to-hyperty-input btn btn-default btn-xl sr-button"  type="submit" value="Say Hello"></form>'
      hello.append(sayHelloTo);
      hello.animate({ scrollTop: $("#actiondown").offset().top }, 500);
      $('.say-hello').on('submit', sayHelloToRemoteHyperty);
      //firstContactRemote = false;
   /* }
    else {
      hello.removeClass('hide');
    }*/
  }
}

/** Enable the local sent "Hello" **/
function enableSayHelloToLocal() {
  var logs = $('.call-to-action');
  logs.append('<div>You can say hello to this local Hyperty</div>');
}

/** Sent Hello to remote hyperty **/
function sayHelloToRemoteHyperty(event) {
  if (checkLoad()) {
    event.preventDefault();
    console.log('event->', event);

    let toHypertyForm = $(event.currentTarget);

    toHyperty = toHypertyForm.find('.to-hyperty-input').val();

    console.log(toHyperty);

    hypertyReporter.instance.hello(toHyperty).then(function (helloObject) {
      var logs = $('.call-to-action');
      logs.append('<div> You sent "Hello" to Remote Hyperty </div>')
      logs.append('<div>Observer Url : ' + toHyperty + '</div>');

      var actionsPanel = $('.action-panel');
      actionsPanel.append('<p><b>'
        + ' You sent "Hello" to Remote Hyperty <br>');
      actionsPanel.append('<p>The remote Observer Url is ' + toHyperty + '</p>');

      actionsPanel.animate({ scrollTop: $("#actiondown").offset().top }, 500);
      /*let collection = $('.collection');
      let hello = $('.hello-panel');
      hello.addClass('hide');*/

      if (!sent) {
        logs.append('<div>You can say "Bye" to a remote Hyperty.</div>');
        sent = true;
      }
    }).catch(function (reason) {
      console.error(reason);
    });
  }
}

/** Sent bye to remote hyperty**/
function sayByeToHyperty() {
  if (checkLoad()) {
    hypertyReporter.instance.bye();
    logs.append('<div> You sent "Bye" to Hypperty <div>')
    logs.append('<div>The HypertyUrl that receive "Bye" is ' + toHyperty + '</div>');
  }
}

/** Add Eventlistener on hyperty actions **/
function hypertyDeployed(result) {
  let hypertyObserver;

  hypertyObserver = result.instance;
  let logs = $('.call-to-action');
  console.log("hypertyObserver", hypertyObserver);
  logs.append("<div> hypertyObserver --> " + hypertyObserver + "</div>");
  logs.append("<div> hypertyObserver._domain --> " + hypertyObserver._domain + "</div>");
  logs.append("<div> hypertyObserver._objectDescURL --> " + hypertyObserver._objectDescURL + "</div><br>");


  $('.selection-panel').hide();

  var actionsPanel = $('.action-panel');
  actionsPanel.append('<p>The current Hyperty Observer URL is :' + result.runtimeHypertyURL + '</p>');
  actionsPanel.animate({ scrollTop: $("#actiondown").offset().top }, 500);
  // Add an invitation Callback
  hypertyObserver.addEventListener('invitation', function (identity) {

    JSON.stringify(identity);

    console.log('Your received a invitation event from:', identity);
    logs.append('<div> Your received a invitation event from:--> ' + identity + '</div>');

    actionsPanel.append('<p><b>'
      + ' Notification from Observer Hyperty ---> Invitation Received <br>' +
      '<hr style="border:1px solid;"/></b></p>');
    actionsPanel.append('<p> You received invitation from:' + identity.userProfile.username + '</p>');
    actionsPanel.animate({ scrollTop: $("#actiondown").offset().top }, 500);
  });


  hypertyObserver.addEventListener('hello', function (event) {

    console.log('Hello event received:', event);
    logs.append('<div> Your received a "Hello" event from:--> ' + hypertyObserver + '</div>');
    actionsPanel.append('<p><b>'
      + ' Notification from Observer Hyperty ---> You have a new message<br>' +
      '<hr style="border:1px solid;"/></b></p>');
    actionsPanel.append('<p> Message: ' + event.hello + '</p>');
    actionsPanel.animate({ scrollTop: $("#actiondown").offset().top }, 500);
  });

  console.log('Observer Waiting for Hello!!');
  logs.append('<div> Observer Waiting for Hello!! </div>');

}

function checkLoad() {

  var loadStatus = false;

  if (isLoad.reporterIsLoad && isLoad.observerIsLoad) loadStatus = true;

  else {
    if (!isLoad.reporterIsLoad && !isLoad.observerIsLoad) alert("Load Reporter Hyperty and Observer Hyperty");
    else if (!isLoad.reporterIsLoad && isLoad.observerIsLoad) alert("Load Reporter Hyperty");
    else alert("Load Observer Hyperty");
  }

  return loadStatus;


}


