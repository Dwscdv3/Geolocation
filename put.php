<?php

if (!empty($_REQUEST["id"]) &&
    is_numeric($_REQUEST["time"]) &&
    is_numeric($_REQUEST["lng"]) &&
    is_numeric($_REQUEST["lat"]) &&
    is_numeric($_REQUEST["range"])) {

    if (!file_exists("data")) {
        mkdir("data");
    }

    file_put_contents("data/" . rawurlencode($_REQUEST["id"]),
        $_REQUEST["time"] . "\n" .
        $_REQUEST["lng"] . "\n" .
        $_REQUEST["lat"] . "\n" . 
        $_REQUEST["range"]
    );
}