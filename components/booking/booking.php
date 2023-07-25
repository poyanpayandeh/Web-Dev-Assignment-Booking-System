<?php
    // Author: Poyan Payandeh
    // Student ID: SWM6076
    // This file connects with booking.js to provide server function to booing.js and booking.html

    // connect to database
    $sql_host = "cmslamp14.aut.ac.nz";
    $sql_user = "swm6076";
    $sql_pass = "Lucky123+1";
    $sql_db = "swm6076";
    $sql_table = "booking";
    // create connection
    $conn = new mysqli($sql_host, $sql_user, $sql_pass, $sql_db);
    // check connetion
    if($conn->connect_error){
        die('Connection Failed'. $conn->connect_error);
    }

    //check for http request
    if(isset($_POST['action'])) {
        $act = $_POST['action'];

        // get data from http request
        if($act === 'createBooking') {
            $data = json_decode($_POST['data']);
            //print_r($data);
        }

        // store inputted data into variables
        $cname = $data[0];
        $phone = $data[1];
        $unumber = $data[2];
        $snumber = $data[3];
        $stname = $data[4];
        $sbname = $data[5];
        $dsbname = $data[6];
        $pick_up_date = $data[7];
        $pick_up_time = $data[8];

        // get current time
        $currentTime = date('H:i:s');

        //create Booking Number
        $bookingNumber = "BRN";
        // creats random number with five digits
        $randomNum = substr(str_shuffle("0123456789"), 0, 5);
        $bookingNumber = $bookingNumber . $randomNum;
        // echo $bookingNumber;
        $query = "INSERT INTO booking(booking_number, booked_time, customer_name, phone_number, unit_number, street_number, street_name, suburb, destination_suburb, pick_up_date, pick_up_time)
        VALUES('$bookingNumber','$currentTime','$cname','$phone','$unumber','$snumber','$stname','$sbname','$dsbname','$pick_up_date','$pick_up_time')";
        if($conn->query($query)) {
            //http response if successful
            //return the booking that was just added into the database
            $query = "SELECT * FROM booking WHERE booking_number = '$bookingNumber'";
            $result = $conn->query($query);
            $book = $result->fetch_assoc();
            echo json_encode($book);
        } else {
            //http response if failed
            echo $conn->error;
        }
    }
?>