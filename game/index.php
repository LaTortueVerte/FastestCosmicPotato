<?php
    session_start();
    if(!isset($_SESSION["username"]))
    {
        header("Location: login.php");
        exit(); 
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" contetn="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🥔FatestCosmicPotato</title>
    <style>
        *{
            padding : 0;
            margin: 0;
        }
    </style>
</head>
<body onResize="window.location.href = window.location.href;">
    <script src="../node_modules/pixi.js/dist/browser/pixi.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script type="module" src="./app.js"></script>
<body>
</html>