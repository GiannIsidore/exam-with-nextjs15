<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

include 'connection.php';


class Transactions {
    private $pdo;
    public function __construct($pdo){ 
        $this->pdo = $pdo;
    }
    public function addTransaction($json){
        try {
            $stmt = $this->pdo->prepare("INSERT INTO xtbltransaction (trans_cust_id, trans_size_id, trans_qty, trans_price, trans_amount) VALUES (:cust_id, :size_id, :qty, :price, :amount)");
            
            $stmt->bindParam(':cust_id', $json['cust_id'], PDO::PARAM_INT);
            $stmt->bindParam(':size_id', $json['size_id'], PDO::PARAM_INT);
            $stmt->bindParam(':qty', $json['qty'], PDO::PARAM_INT);
            $stmt->bindParam(':price', $json['price'], PDO::PARAM_STR);
            $stmt->bindParam(':amount', $json['amount'], PDO::PARAM_STR);
            
            $stmt->execute();
            
            $lastInsertId = $this->pdo->lastInsertId();
            
            echo json_encode(['status' => 'success', 'message' => 'Transaction added successfully', 'id' => $lastInsertId]);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
    public function fetchTransaction(){
        try {
            $query = "SELECT
                `trans_id`,
                xtblcustomers.cust_name,
                xtblsize.size_text,
                `trans_qty`,
                `trans_price`,
                `trans_amount`
            FROM
                `xtbltransaction`
            INNER JOIN
                xtblcustomers ON xtbltransaction.trans_cust_id = xtblcustomers.cust_id
            INNER JOIN
                xtblsize ON xtbltransaction.trans_size_id = xtblsize.size_id";
            
            $stmt = $this->pdo->prepare($query);
            $stmt->execute();
            $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(['status' => 'success', 'data' => $transactions]);
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

$transaction = new Transactions($pdo);   

switch ($operation){
    case 'addTransaction':
        $transaction->addTransaction($json);
        break;
    case 'fetchTransaction':
        $transaction->fetchTransaction();
        break;
}
