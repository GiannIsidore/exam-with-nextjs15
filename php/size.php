<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

include 'connection.php';

class Sizes {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function addSize($json) {
        try {
            $stmt = $this->pdo->prepare("INSERT INTO xtblsize (size_text) VALUES (:size_text)");
            
            $stmt->bindParam(':size_text', $json['size_text'], PDO::PARAM_STR);
            
            $stmt->execute();
            
            $lastInsertId = $this->pdo->lastInsertId();
            
            echo json_encode(['status' => 'success', 'message' => 'Size added successfully', 'id' => $lastInsertId]);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function fetchSizes() {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM xtblsize");
            $stmt->execute();
            $sizes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(['status' => 'success', 'data' => $sizes]);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $operation = isset($_GET['operation']) ? $_GET['operation'] : '';
    $json = isset($_GET['json']) ? json_decode($_GET['json'], true) : null;
}
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $operation = isset($_POST['operation']) ? $_POST['operation'] : '';
    $json = isset($_POST['json']) ? json_decode($_POST['json'], true) : null;
}

$sizes = new Sizes($pdo);

switch ($operation) {
    case 'addSize':
        $sizes->addSize($json);
        break;
    case 'fetchSizes':
        $sizes->fetchSizes();
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
        break;
}
