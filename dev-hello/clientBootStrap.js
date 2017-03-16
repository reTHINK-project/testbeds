/**
* This is the very first bootstrap for rethink. It allows only to load the rethink runtime.
*
*/

/** Public region **/

/** TODO --> Choix du domain via input **/
let domain;
let bootStrapDomain = "call.rethink.orange-labs.fr";

/** Region Variables **/

let RUNTIME;
let runtimeURL;

/**
 returns a Promise. Success when runtime is loaded.
*/
function registerDomain() {
	var currentDomain = bootStrapDomain;//$("#domainUri").val();
	domain = currentDomain;
	bootStrapDomain = currentDomain;
	var promise = new Promise(function(resolve, reject) {
		var script = document.createElement('script');
        script.src = `https://${bootStrapDomain}/.well-known/runtime/rethink.js`;
		script.addEventListener('load', function() {
                resolve(script);
            }, false);
            script.addEventListener('error', function() {
                reject(script);
                console.log('was rej');
            }, false);
            document.head.appendChild(script);
	});
	return promise.then(
	// rethink.js loaded
	function(result){
		// Promise to load the runtime
		return new Promise(function(resolve, reject) {
		  var start = new Date().getTime();
		  runtimeURL = `hyperty-catalogue://catalogue.${domain}/.well-known/runtime/Runtime`; 
		  rethink.default.install({
			domain: domain,
			development: false,
			runtimeURL: runtimeURL
		  }).then((runtime) => {
				RUNTIME = runtime
				var time = (new Date().getTime()) - start;
				var logs = $('.call-to-action');
				logs.append('<span>Runtime has been successfully launched in ' + time / 1000 + ' seconds</sapn>');
				resolve("Success");
			  }, 
			  (err) => {
					reject(Error("Unable to load the runtime at " + runtimeURL));
				}
			);
		});
	});
}



