<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" contetn="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🥔FatestCosmicPotato</title>
</head>
<body>
    <?php
        // Include files
        require('..\database\CRUD.php');
        // Define variables and initialize with empty values

        $username = $email = $password = $lastname = $firstname = "";
        $username_err = $email_err = $password_err = $firstname_err = $lastname_err = "";

        // Processing form data when form is submitted

        $condition = isset($_REQUEST['username'], $_REQUEST['email'], $_REQUEST['password']);

        if ($condition)
        {
            // Valide username

            $input_username = $_POST["username"];

            if(empty($input_username))
            {
                $username_err = "Please enter a name.";
            } 
            elseif(!preg_match("/^[a-zA-Z0-9-_]*$/",$input_username))
            {
                $username_err = "Please enter a valid username, use only alphabetic characters, numbers and '_'.";
            } 
            else
            {
                $username = $input_username;
            }

            // Validate email

            $input_email = $_POST["email"];

            if (empty($input_email)) 
            {
                $email_err = "Please enter a email.";
            }
            elseif (!filter_var($input_email, FILTER_VALIDATE_EMAIL))
            {
                $email_err = "Invalid email format";
            }
            else
            {
                $email = $input_email;
            }

            // Validate password:

            $input_password = $_POST["password"];

            if (empty($input_password))
            {
                $password_err = " Please enter a password.";
            }
            else
            {
                $password = $input_password;
            }
        }

        if($condition && empty($username_err) && empty($email_err) && empty($password_err) )
        {
            if(create("users", array(   "username"          =>  $username,
                                        "email"             =>  $email,
                                        "password"          =>  hash('sha256', $password))))
            {
                echo "  <div>
                            <h3>You are successfully registered</h3>
                            <p>Clic here to <a href='login.php'>login</a></p>
                        </div>";
            }
            else
            {
                header("Location: error.php");
                exit();
            }
        }
        else
        {

            ?>

            <form action="" method="post">

                <h1>Sign out</h1>

                <div>

                    <label>Username</label>
                    <input type="text" name="username" value="<?php echo $username; ?>">
                    <span><?php echo $username_err;?></span>

                </div>

                <div>

                    <label>Email</label>
                    <input type="text" name="email" value="<?php echo $email; ?>">
                    <span><?php echo $email_err;?></span>

                </div>

                <div>

                    <label>Password</label>
                    <input type="password" name="password" minlength="8" autocomplete=off>
                    <span><?php echo $password_err;?></span>

                </div>

                <input type="submit" name="submit" value="Sign up" />

                <p>Already register? <a href="login.php">Log in</a></p>

            </form>

        <?php } ?>

</body>
</html>