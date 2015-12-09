<?php

date_default_timezone_set("Europe/Paris");

/**
 * These are the database login details
 */
define('HOST', '127.0.0.1');     // The host you want to connect to.
define('USER', 'root');    // The database username.
define('PASSWORD', 'demoService1');    // The database password.
define('DATABASE', 'demo');    // The database name.

define('CAN_REGISTER', 'any');
define('DEFAULT_ROLE', 'member');
define('SECURE', 'false');

/*
* Specifies the SP's PATH
* 
*/
define("SP_PATH", '/' . basename(dirname($_SERVER['SCRIPT_FILENAME'])));

$SP_URL="https://coolapp.rethink.orange-labs.fr/demo";
$IDP_URL="https://oidc-ns.kermit.orange-labs.fr/phpOp/index.php";

$REDIRECT_URI=$SP_URL."/demoback.php";

$CLIENT_ID="-9fBFDCsc42LCN8ulgkVdw";
$CLIENT_SECRET="PuKy2GqmGEoTpQ";

$RESPONSE_TYPE="code";
$RESPONSE_TYPE_SIGNIN="id_token";
$SCOPE="profile openid email";
$SCOPE_LOGIN="openid";

?>
