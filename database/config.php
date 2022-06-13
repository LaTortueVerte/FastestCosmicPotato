<?php
    $DB_SERVER =  'localhost';
    $DB_USERNAME = 'root';
    $DB_PASSWORD =  '';
    $DB_NAME = 'game_fastestcosmicpotato';
    // Connection
    $conn = mysqli_connect($DB_SERVER, $DB_USERNAME, $DB_PASSWORD, $DB_NAME);
    // Check connection
    if($conn === false)
    {
        die("ERREUR : Impossible de se connecter. " . mysqli_connect_error());
    }
?>