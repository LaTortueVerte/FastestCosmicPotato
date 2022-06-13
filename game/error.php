<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" contetn="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🥔FatestCosmicPotato</title>
</head>
<body>
    <div>
        <h1>Invalid Request</h1>
        <h2>
            <?php
            if (!empty($_GET["error"]))
            {
                echo $_GET["error"];
            }
            ?>
        </h2>
        <div>Sorry, you've made an invalid request. Please <a href="error.php?return=1">go back to menu</a> </div>
    </div>   
</body>  
</html>