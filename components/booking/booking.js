// Author: Poyan Payandeh
// Student ID: SWM6076
// This file connects to both booking.html and booking.php to send requests to the server and make changes on user interface
// function toggleReference() this function checks and toggles the display settings for the refrence message if a booking is made
// function formatDate(date) this function takes the date provided by html forms date and formatts so that it can be used in the confirmation message

// get date and format it
const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0
let dd = today.getDate();

// add "0" to month and day if below 0
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

// formatted to go into html date input and save to date input
const formattedDate = yyyy + '-' + mm + '-' + dd;
document.getElementById('date').value = formattedDate;

// get time from date object and store into time input value
let hours = today.getHours();
let minutes = today.getMinutes();
//format time for html time input
if (minutes < 10) minutes = '0' + minutes;
if (hours < 10) hours = '0' + hours;
let formattedTime = hours + ":" + minutes;
document.getElementById('time').value = formattedTime;

// event listner to check for form submit
document.getElementById("bookingForm").addEventListener("submit", createBooking);
// event listner to bring form back
document.getElementById("reference").addEventListener("click", toggleReference);

function createBooking(e){
    // prevent refresh
    e.preventDefault();

    // get form data and save into array
    let data = [];
    let formList = document.querySelectorAll(".inputs");
    formList.forEach(function(e1){
        data.push(e1.value)
    })
    // turn array into json data
    data = JSON.stringify(data);
    data = encodeURIComponent(data);

    let xhr = new XMLHttpRequest();
    let params = `action=createBooking&data=${data}`;
    xhr.open("POST", "http://swm6076.cmslamp14.aut.ac.nz/assign2/components/booking/booking.php", true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if(xhr.status == 200){
            //save response to array
            let booking = JSON.parse(xhr.responseText);
            // get date from response
            let date = booking.pick_up_date;
            //format date
            date = formatDate(date);
            //get elements of confirmation message and save values into them
            document.getElementById("bkNum").innerHTML = booking.booking_number;
            document.getElementById("timeMsg").innerHTML = booking.pick_up_time;
            document.getElementById("dateMsg").innerHTML = date;
            // show confirmation message on booking.html
            toggleReference();
        }
    }
    xhr.send(params);
}

// function to toggle confirmation request
function toggleReference() {
    let ref = document.getElementById('reference');
    let form = document.getElementById("in");

    if(ref.style.display == "flex") {
        ref.style.display = "none";
        form.style.display = "block";
    } else {
        ref.style.display = "flex";
        form.style.display = "none";
    }
}

//function to format date for confirmation message
function formatDate(date) {
    let formatted = "";
    let dateArray = date.split("-");
    formatted = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
    return formatted;
}