<?php 

include('db_connect.php');

header('Content-Type: application/json');

if($_SERVER["REQUEST_METHOD"] == "POST")
{
    $data = json_decode(file_get_contents("php://input"), true);

    $username = trim($data['username']);
    $email = trim($data['email']);
    $password = password_hash($data['password'], PASSWORD_DEFAULT);

    $check = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $result = $check->get_result();

    if($result->num_rows > 0) 
    {
        echo json_encode(['success' => false, 'message' => 'Email already registered.']);
    } 
    else 
    {
        $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $email, $password);
        if($stmt->execute())
        {
            echo json_encode(['success' => true, 'message' => 'Registration successful!']);
        } 
        else 
        {
            echo json_encode(['success' => false, 'message' => 'Database error. Please try again.']);
        }
    }
}
?>
