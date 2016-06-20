<?php
session_start();
require_once( 'Facebook/autoload.php' );

$fb = new Facebook\Facebook([
  'app_id' => '554357831402861',
  'app_secret' => '5428d5692c2f38e39025429bbec79a69',
  'default_graph_version' => 'v2.5',
]); 
  
$helper = $fb->getRedirectLoginHelper();  
  
try {  
  $accessToken = $helper->getAccessToken();  
} catch(Facebook\Exceptions\FacebookResponseException $e) {  
  // When Graph returns an error  
  
  echo 'Graph returned an error: ' . $e->getMessage();  
  exit;  
} catch(Facebook\Exceptions\FacebookSDKException $e) {  
  // When validation fails or other local issues  

  echo 'Facebook SDK returned an error: ' . $e->getMessage();  
  exit;
}  


try {
  // Get the Facebook\GraphNodes\GraphUser object for the current user.
  // If you provided a 'default_access_token', the '{access-token}' is optional.
  $response = $fb->get('/me?fields=id,name,email,first_name,last_name', $accessToken->getValue());
//  print_r($response);
} catch(Facebook\Exceptions\FacebookResponseException $e) {
  // When Graph returns an error
  echo 'ERROR: Graph ' . $e->getMessage();
  exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
  // When validation fails or other local issues
  echo 'ERROR: validation fails ' . $e->getMessage();
  exit;
}

$me = $response->getGraphUser();
//print_r($me);
/* print info for debug 
echo "Full Name: ".$me->getProperty('name')."<br>";
echo "First Name: ".$me->getProperty('first_name')."<br>";
echo "Last Name: ".$me->getProperty('last_name')."<br>";
echo "Email: ".$me->getProperty('email')."<br>";
echo "Facebook ID: <a href='https://www.facebook.com/".$me->getProperty('id')."' target='_blank'>".$me->getProperty('id')."</a>";
*/

//create the url for profile picture
$profile_pic =  "http://graph.facebook.com/".$me->getProperty('id')."/picture";

$_SESSION['access_token']=$accessToken;
$_SESSION['type']='facebook';
$_SESSION['username'] = $me->getProperty('name');
$_SESSION['profile_picture'] = $profile_pic;

/* echo the image out
echo "<img src=\"" . $profile_pic . "\" />"; 
*/
?>
