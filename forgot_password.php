<?php
    include('db_connect.php');
    header('Content-Type: application/json');

    $data = json_decode(file_get_contents("php://input"), true);
    $email = trim($data['email']);

    if (empty($email)) 
    {
        echo json_encode(['success' => false, 'message' => 'Email required']);
        exit;
    }

    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) 
    {
        echo json_encode(['success' => false, 'message' => 'No account with this email']);
        exit;
    }

    $user = $result->fetch_assoc();
    $userId = $user['id'];

    // Generate reset token and expiration
    $token = bin2hex(random_bytes(16));
    $expires = date("Y-m-d H:i:s", strtotime("+1 hour"));

    // Save token and expiration in DB
    $stmt = $conn->prepare("UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?");
    $stmt->bind_param("ssi", $token, $expires, $userId);
    $stmt->execute();

    // Send email (example with PHP mail, can use PHPMailer for real email)
    $resetLink = "http://localhost/CSE3311-Team7-PetSocialMediaApp-main/ResetPassword.html?token=$token";
    $subject = "Password Reset Request";
    $message = "Click this link to reset your password: $resetLink\nThis link expires in 1 hour.";
    $headers = "From: noreply@pawpals.com";

    mail($email, $subject, $message, $headers);

    echo json_encode(['success' => true, 'message' => 'Password reset link sent']);
?>
