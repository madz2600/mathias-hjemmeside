<?php
//<!--
//-------------------------------------
//- Feedback Form -
//- copyright (c) James Coyle; JCcorp -
//- JCcorp.net -
//- Release 25-07-2006 -
//- Ver 1.0.1 -
//-------------------------------------
//-->
// Edit the below fields
$admin = 'madslentoft@gmail.com' ; // Change to your admin email 'from' address
$replymsg = 'Thank you for your email. We will respond shortly if required.' ; // Reply message to send
$formurl = 'index.html' ; // the URL where the form code is - default: form.php
$errorurl = 'error.html' ; // the URL to show on error - default error.html
$thankyouurl = 'thankyou.html' ; // the URL to show feedback submitted - default: thankyou.html
// Security code to prevent addition of extra emails by spambots
function remove_headers($string) {
$headers = array(
"/to\:/i",
"/from\:/i",
"/bcc\:/i",
"/cc\:/i",
"/Content\-Transfer\-Encoding\:/i",
"/Content\-Type\:/i",
"/Mime\-Version\:/i"
);
if (preg_replace($headers, '', $string) == $string) {
return $string;
} else {
die('You are not completing the form correctly.');
}
}
$uself = 0;
$headersep = (!isset( $uself ) || ($uself == 0)) ? "\r\n" : "\n" ;
// Variables
$email = remove_headers($_POST['email']) ;
$name = remove_headers($_POST['name']) ;
$subject = remove_headers($_POST['subject']) ;
$message = remove_headers($_POST['message']) ;
$wordcount = str_word_count($message); 
// Code to prevent addition of / before ' in text entered by viewer
if (get_magic_quotes_gpc()) {
$name = stripslashes( $name );
$subject = stripslashes( $subject );
$message = stripslashes( $message );
}
// If email is filled out, proceed, if not, display the form
if (!isset($_POST['email'])) {
header( "Location: $formurl" ); //
}
// If a bot is attempting to send spam it will complete this input while viewers don't see the visibility: hidden box
elseif ($_POST['catchbot'] !="") {
//Boot it out of the server
die();
} 
// Code to check for empty input boxes
elseif (empty($email) || empty($name) || empty($subject)) {
header( "Location: $errorurl" );
}
// Security code to check that email address is probably valid and only contains one address
elseif
(!preg_match("/^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i",$email)) {
header( "Location: $errorurl" );
exit ;
}
// Security code to prevent addition of new lines entered into the $name and $email fields by spambots
elseif ( preg_match( "[\r\n]", $name ) || preg_match( "[\r\n]", $email ) ) {
header( "Location: $errorurl" );
exit ;
}
elseif ($wordcount >50) {
echo "Please do not exceed fifty words.";
}
//WORDCOUNT ADDED but . in a word like formemail.php causes extra word; echo will show in plain text in a new window with default browser background color (an alternative to header( "Location: $errorurl" ); which shows a complete html page)
else {
mail( $admin, "Feedback: $subject", "$name\r\n$email\r\n$message", "From: $name <$admin>" );
mail( $email, "Feedback: $subject",	 $replymsg , "From: Lost Signal Games" );
header( "Location: $thankyouurl" );
}
?>








