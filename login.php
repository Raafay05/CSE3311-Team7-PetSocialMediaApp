<?php
include('db_connect.php');
session_start();

header('Content-Type: application/json');

if($_SERVER["REQUEST_METHOD"] == "POST")
{
    $data = json_decode(file_get_contents("php://input"), true);

    $username = trim($data['username']);
    $password = trim($data['password']);

    $stmt = $conn->prepare("SELECT username, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result && $result->num_rows === 1) 
    {
        $row = $result->fetch_assoc();
        if(password_verify($password, $row['password'])) 
        {
            $_SESSION['username'] = $row['username'];
            echo json_encode(['success' => true]);
        } 
        else 
        {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    } 
    else 
    {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
    $stmt->close();
    $conn->close();
}
?>
