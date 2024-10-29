<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

include 'connection.php';

class Customers {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function addCustomer($json) {
        try {
            $stmt = $this->pdo->prepare("INSERT INTO xtblcustomers (cust_name, cust_address) VALUES (:name, :address)");
            
            $stmt->bindParam(':name', $json['name'], PDO::PARAM_STR);
            $stmt->bindParam(':address', $json['address'], PDO::PARAM_STR);
            
            $stmt->execute();
            
            $lastInsertId = $this->pdo->lastInsertId();
            
            echo json_encode(['status' => 'success', 'message' => 'Customer added successfully', 'id' => $lastInsertId]);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function fetchCustomers() {
        try {
            $stmt = $this->pdo->prepare(" SELECT * FROM xtblcustomers ORDER BY cust_name ASC ");
            $stmt->execute();
            $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(['status' => 'success', 'data' => $customers]);
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

$customers = new Customers($pdo);

switch ($operation) {
    case 'addCustomer':
        $customers->addCustomer($json);
        break;
    case 'fetchCustomers':
        $customers->fetchCustomers();
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
        break;
}
