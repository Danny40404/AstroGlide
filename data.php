<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$s = "localhost";
$u = "Server";
$p = "scoreBoard";

$conn = new mysqli($s, $u, $p, "astroglide");
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['dataname'] ?? '';
    $punkte = $_POST['datapunkte'] ?? 0;
    $date = date('Y-m-d H:i:s');

    $sql = $conn->prepare("
    INSERT INTO astroglide (`Name`, `Score`, `Datum`) VALUES (?, ?, ?)");
    $sql->bind_param("sis", $name, $punkte, $date);

    if ($sql->execute()) {
        echo json_encode([
            'status' => 'success',
            'received' => ['name' => $name, 'punkte' => $punkte]
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => $sql->error
        ]);
    }
    $sql->close();
} else {
    $sql = "SELECT * FROM astroglide ORDER BY Score DESC LIMIT 5";
    $result = $conn->query($sql);

    if ($result) {
        $array = array();

        while($row = $result->fetch_assoc()) {
            
            $array[] = array("Name" => $row["Name"], "Score" => $row["Score"]);
        }

        $output = json_encode($array);
        echo $output;
    } else {
        echo "0 results";
    }
}
$conn->close();
