<?php
include_once 'includes/functions.php';
include_once 'includes/dbfront.php';
if(false){
$session_path = session_save_path() . SP_PATH;
if(!file_exists($session_path))
    mkdir($session_path);
session_save_path($session_path);
}
sec_session_start ();
setlocale(LC_ALL, 'fr_FR');
$pdo=connect();

// delete user function, then redirect to index.php
if( isset($_GET['delete']) ) {
	$id = $_GET['delete'];
	deleteUser($pdo, $id);
	header("Location: index.php");
	return;
}
// delete session function, then redirect to index.php
if( isset($_GET['logout']) ) {
	clearSession();
	header("Location: index.php");
	return;
}
?>

<!DOCTYPE html>
<html>
  <head><title>Demo Service Provider</title>
<h1>Welcome to the Demo Service that doesn't make anything</h1><br>
  <meta name="viewport" content="width=320">
  </head>
  <body>
<?php
if (!isset($_SESSION['USER']))// add link to enroll users
{
	echo 'No session, please login (use of OIDC server)
	<br><br><form method="link" action="'.$SP_URL.'/demo.php"> <input type="submit" value="Login"></form>';
}
else
{
	echo '<h3>Welcome '.$_SESSION['USER']['firstName']
	.'</h3><br><br>User logged in<br><form method="get" action="'.$SP_URL.'/index.php">
	<input type="hidden" name="logout"><input type="submit" value="Logout"></form>';
}


?>
  </body>
</html>
