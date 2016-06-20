<?php
    session_start();
    require 'TwitterAPILoader.php';
    use Abraham\TwitterOAuth\TwitterOAuth;
    define('CONSUMER_KEY', 'Q5iD9LEWOgNaKkwu1OrJnAJyW');
    define('CONSUMER_SECRET', 'TeFyW8UuXxGT3tlTgvaUD5OoKvJXXFBsExy2hH3cdrJdfwmVYJ');
    define('OAUTH_CALLBACK', 'http://127.0.0.1/FaceMaze/twitteroauth/callback.php');


    $friends= array(
        array(  'nume' => 'pogchamp',
                'poza' => 'friends/pogchamp.png'),
        array(  'nume' => 'kreygasm',
                'poza' => 'friends/kreygasm.png'),
        array(  'nume' => 'kappa',
                'poza' => 'friends/kappa.png'),
        array(  'nume' => 'doge',
                'poza' => 'friends/doge.png')
    );

    if (isset($_SESSION['type'])){
        if ($_SESSION['type']=='insta' &&
            isset($_SESSION['access_token']))
            {
                $ch = curl_init('https://api.instagram.com/v1/users/self/follows?access_token='.$_SESSION['access_token']);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                $result = curl_exec($ch);
                curl_close($ch);
                $result=json_decode($result, true);
                foreach ($result['data'] as $key => $value)
                {
                    $nume=$result['data'][$key]['full_name'];
                    $poza=$result['data'][$key]['profile_picture'];
                    array_unshift($friends,array('nume'=>$nume,'poza'=>$poza));
                }
            }       
    }
    else
    {
        if (isset($_SESSION['access_token'])) 
            {
                $access_token = $_SESSION['access_token'];
                $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
                $followers = $connection->get("friends/list");
                foreach ($followers->users as $key => $value) 
                {
                    $nume=$followers->users[$key]->screen_name;
                    $poza=$followers->users[$key]->profile_image_url;
                    array_unshift($friends,array('nume'=>$nume,'poza'=>$poza));
                } 
            }

        
    }
    $rand_keys = array_rand($friends, 4);       
    foreach ($rand_keys as $key => $value)
    {
        echo '<p id="charname'.$key.'" style="display:none;">'.$friends[$value]['nume'].'</p>';
        echo '<img id="charimg'.$key.'" style="display:none;" width=150 height=150 src="'.str_replace('_normal', '', $friends[$value]['poza']).'"></img>';
    }
?>

<!DOCTYPE html> 
<html lang="en" style="height:100%;">
    <head> 
        <meta charset="utf-8"> 
        <title>FaceMaze</title>
        <link rel="icon" type="image/x-icon" href="images/brand/pac_icon.png">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
        <meta name="keywords" content="pinegrow, blocks, bootstrap" />
        <meta name="description" content="My new website" />
        <link rel="shortcut icon" href="ico/favicon.png"> 
        <!-- Core CSS -->         
        <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet"> 
        <link href="css/font-awesome.min.css" rel="stylesheet">
        <link href="http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,400,300,600,700" rel="stylesheet">
        <link href="http://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic,700italic" rel="stylesheet">
        <!-- Style Library -->         
        <link href="css/style-library-1.css" rel="stylesheet">
        <link href="css/plugins.css" rel="stylesheet">
        <link href="css/blocks.css" rel="stylesheet">
        <link href="css/custom.css" rel="stylesheet">
        <!-- HTML5 shim, for IE6-8 support of HTML5 elements. All other JS at the end of file. -->         
        <!--[if lt IE 9]>
      <script src="js/html5shiv.js"></script>
      <script src="js/respond.min.js"></script>
    <![endif]-->         
    </head>     
    <body data-spy="scroll" data-target="nav">
        <header id="header-3" class="soft-scroll header-3">
            <!-- /.nav -->
            <section class="hero">
                <div class="container">
                    <div class="navicon">
                        <div class="col-md-8 col-md-offset-2 text-center">
                            <div class="editContent">
                                <img src="	images/brand/FaceMaze_logo.png" width="500" />
                            </div>
                            <div class="editContent">
                                <h1>FaceMaze</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8 col-md-offset-2 text-center">
                        <div class="editcontent">
                            <div class="col-md-4 nav-item" href="#content-2-7" style="display:table-cell; vertical-align:middle; text-align:center">
                                <a href="http://127.0.0.1/FaceMaze/twitter_login.php" class="nav-slide-btn">
                                    <img src="images/brand/Twitter_logo.png" onmouseover="this.src='images/brand/Twitter_logo_original.png';" onmouseout="this.src='images/brand/Twitter_logo.png';" class="img-responsive v-center" width="100">
                                </a>
                            </div>
                            <div class="col-md-4">
                                <a class="nav-slide-btn">
                                    <img src="images/brand/facebook_logo.png" onmouseover="this.src='images/brand/facebook_logo_original.png';" onmouseout="this.src='images/brand/facebook_logo.png';" class="img-responsive v-center" width="100">
                                </a>                                 
                            </div>
                            <div class="col-md-4">
                                <a href="instagram_login.php" class="nav-slide-btn">
                                    <img src="images/brand/Instagram_logo.png" onmouseover="this.src='images/brand/Instagram_logo_original.png';" onmouseout="this.src='images/brand/Instagram_logo.png';" class="img-responsive v-center" width="100">
                                </a>                                 
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </header>
        <section id="content-2-7" class="content-block content-2-7">
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="underlined-title">
                            <h1>Brace yourself!</h1>
                            <hr>
                            <h2>You'll <span class="fa fa-heart pomegranate"></span>&nbsp;FaceMaze<br></h2>
                            


                            
                        </div>
                    </div>
                    <div class="col-sm-12">
                        

                            
                            
                        
                    </div>
                </div>

                
				

                <!-- /.row -->
            </div>
            <!-- /.container -->
        </section>

        <script type="text/javascript" src="js/jquery-1.11.1.min.js"></script>         
        <script type="text/javascript" src="js/bootstrap.min.js"></script>         
        <script type="text/javascript" src="js/plugins.js"></script>
        <script src="https://maps.google.com/maps/api/js?sensor=true"></script>
        <script type="text/javascript" src="js/bskit-scripts.js"></script>         
    </body>     
</html>
