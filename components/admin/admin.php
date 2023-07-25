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
    
    // check for request
    if(isset($_GET['ref'])) {
        // save booking number from request
        $bNumber = $_GET['ref'];
        // query sql to search booking number
        $query = "SELECT * FROM booking WHERE booking_number = '$bNumber'";
        $result = $conn->query($query);

        // check if result was successful
        if($result) {
            // check if the search found anything
            if($result->num_rows == 0) {
                echo "No Results Found!";
            } else {
                // get result and send it back to admin.js
                $booking = $result->fetch_assoc();
                echo json_encode($booking);
            }
        } else {
            echo "There was a problem with the statement";
        }
    } else {
        // get current time - 2 hours
        $searchTime = date('H:i:s', strtotime(' - 2 hours'));
        $currentTime = date('H:i:s');
        //query sql for result
        $query = "SELECT * FROM `booking` WHERE `booked_time` > '$searchTime' AND `booked_time` <= '$currentTime'";
        $result = $conn->query($query);
        // check if result was successful
        if($result) {
            // save results
            if($result->num_rows == 0) {
                // if no results
                echo "No Results Found!";
            } else if ($result->num_rows == 1) {
                // if only one result
                $booking = $result->fetch_assoc();
                echo json_encode($booking);
            } else {
                // if more than one result
                $bookings = array();
                $i = 0;
                while ($row = $result->fetch_assoc()) {
                    $bookings[$i] = $row;
                    $i++;
                }
                echo json_encode($bookings);
            }
        } else {
            echo "Problem With Statement";
        }
    }
 ?>