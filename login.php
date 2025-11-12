<?php
include('db_connect.php');
session_start();

if($_SERVER["REQUEST_METHOD"] == "POST")
{
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    $stmt = $conn->prepare("SELECT username, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result && $result->num_rows == 1)
    {
        $row = $result->fetch_assoc();
        if(password_verify($password, $row['password']))
        {
            $_SESSION['username'] = $row['username'];
            header("Location: homepage.html");
            exit();
        }
        else
        {
            echo "Invalid password.";
        }
    }
    else
    {
        echo "Username not found";
    }
    $stmt->close();
    $conn->close();
}
?>
