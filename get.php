<?php

if (!empty($_REQUEST["id"])) {
    if (file_exists("data/" . $_REQUEST["id"])) {
        $data = explode("\n", file_get_contents("data/" . rawurlencode($_REQUEST["id"])));
        echo json_encode(array(
            "time" => $data[0],
            "lng" => $data[1],
            "lat" => $data[2],
            "range" => $data[3]
        ));
    } else {
        echo json_encode(array(
            "error" => "404",
            "msg" => "不存在此 ID 的数据。"
        ));
    }
}