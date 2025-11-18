<?php
    include('db_connect.php');
    header('Content-Type: application/json');

    $data = json_decode(file_get_contents("php://input"), true);
    $token = $data['token'] ?? '';
    $newPassword = $data['password'] ?? '';

    if (!$token || !$newPassword) 
    {
        echo json_encode(['success' => false, 'message' => 'Invalid request']);
        exit;
    }

    // Check if token exists and is valid
    $stmt = $conn->prepare("SELECT id, reset_expires FROM users WHERE reset_token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) 
    {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
        exit;
    }

    $user = $result->fetch_assoc();
    if (strtotime($user['reset_expires']) < time()) 
    {
        echo json_encode(['success' => false, 'message' => 'Token expired']);
        exit;
    }

    // Update password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?");
    $stmt->bind_param("si", $hashedPassword, $user['id']);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Password reset successfully']);
?>
