<?php
    // Author: Poyan payandeh
    // Student ID: SWM6076
    // This file connects to admin.js and does server work such as fetching data from the database and sending it to admin.js
    
    // connect to database
    $sql_host = "cmslamp14.aut.ac.nz";
    $sql_user = "swm6076";
    $sql_pass = "Lucky123+1";
    $sql_db = "swm6076";
    // create connection
    $conn = new mysqli($sql_host, $sql_user, $sql_pass, $sql_db);
    // check connetion
    if($conn->connect_error){
        die('Connection Failed'. $conn->connect_error);
    }

    // check is request has been recieved
    if(isset($_GET['number'])) {
        $toSearch = $_GET['number'];
        $toSet = "Assigned";
        
        // query sql to update assignment for given booking number
        $query = "UPDATE booking SET assignment = '$toSet' WHERE booking_number = '$toSearch'";
        $result = $conn->query($query);
        if ($result) {
            if($conn->affected_rows > 0) {
                echo "success";
            } else {
                // do nothing
            }
        } else {
            echo "Problem with statement";
        }
    }
?>