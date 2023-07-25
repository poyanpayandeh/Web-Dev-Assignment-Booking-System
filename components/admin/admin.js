// Author: Poyan Payandeh
// Student ID: SWM6076
// This file connects to the client html file and the server php file and provies logic work
// Functions:
// isInputNumber(e) - a function that recieves events on bsearch to only allow digits to be entered
// search() - a funcion that collects form data from the html and formats it bfore sending to the php file, after sending it to the server it recievess a response
//  generateTable(bookkings) - A function that takes the data from an array and displays it on a table in the html file  
//  generateTableSinigle(bookkings) - A function that takes the data from a variable and displays it on a table in the html file  

//event listener for sbutton
document.getElementById("sbutton").addEventListener("click", search);

// function to only allow digits to be entered into bsearch text input
function isInputNumber(e) {
    let ch = String.fromCharCode(e.which);
    if(!(/[0-9]/.test(ch))) {
        e.preventDefault();
    }
}

// function to search database
function search(){
    // remove search table if it is being displayed and clear it
    let table = document.getElementById("content");
    let tableContent = document.getElementById("bookingTable");
    if(table.style.display == "block") {table.style.display = "none"; tableContent.replaceChildren();}
    // remove confirmation message
    let msg = document.getElementById("assignMsg");
    msg.innerText = "";
    msg.style.display = "none";
    if(document.getElementById("bsearch").value.length < 5 && document.getElementById("bsearch").value.length > 0) {
        let error = document.getElementById("errorMsg");
        error.innerHTML = "Please enter 5 numbers or leave blank!";
        error.style.display = "block"; 
    } else {
        // remove error message if it's being displayed
        let error = document.getElementById("errorMsg");
        if(error.style.display == "block") {
            error.style.display = "none";
        }

        // search for requests within the last 2 hours
        if (document.getElementById("bsearch").value.length == 0) {
            let xhr = new XMLHttpRequest();
            xhr.open("GET","admin.php", true);
            xhr.onload = function() {
                if(xhr.status == 200){
                    if (xhr.responseText === "No Results Found!") {
                        // display error message for no results found
                        let error = document.getElementById("errorMsg");
                        error.innerHTML = xhr.responseText;
                        error.style.display = "block";
                    } else {
                        // get bookings from response
                        let bookings = JSON.parse(xhr.responseText);
                        // generate table from responsedata
                        if(Array.isArray(bookings)) {
                            generateTable(bookings);
                        } else {
                            generateTableSingle(bookings);
                        }
                    }
                }
            }
            xhr.send();
        }

        // search for specific booking number
        if (document.getElementById("bsearch").value.length == 5){
            // get input from bsearch and format it 
            let reference = "BRN" + document.getElementById("bsearch").value;
            // create and send request to admin.php
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "admin.php?ref=" + reference, true);
            xhr.onload = function() {
                if (xhr.responseText === "No Results Found!") {
                    // display error message for no results found
                    let error = document.getElementById("errorMsg");
                    error.innerHTML = xhr.responseText;
                    error.style.display = "block";
                } else {
                    // get bookings from response
                    let bookings = JSON.parse(xhr.responseText);
                    // generate table with response data
                    generateTableSingle(bookings);
                }
            }
            xhr.send();
        }        
    }
}

// function to generate table with multiple objects
function generateTable(bookings) {
    let content = document.getElementById("content");
    let table = document.getElementById("bookingTable");
  
    // Clear the existing table content
    table.innerHTML = "";
  
    // Iterate over each booking in the array
    for (let i = 0; i < bookings.length; i++) {
        let booking = bookings[i];
        let row = `<tr>
                        <td id="bkn">${booking.booking_number}</td>
                        <td>${booking.customer_name}</td>
                        <td>${booking.phone_number}</td>
                        <td>${booking.suburb}</td>
                        <td>${booking.destination_suburb}</td>
                        <td>${booking.pick_up_date} ${booking.pick_up_time}</td>
                        <td id="assign">${booking.assignment}</td>
                        <td><button class="btn">Assign</button></td>
                    </tr>`;
        table.innerHTML += row;
    }
  
    // Add event listeners to all the "Assign" buttons
    let assignButtons = document.getElementsByClassName("btn");
    for (let i = 0; i < assignButtons.length; i++) {
        assignButtons[i].addEventListener("click", assign);
    }
  
    function assign() {
      // Get the booking number and update the database if the assignment is "Unassigned"
      let bkn = this.parentNode.parentNode.querySelector("#bkn").innerHTML;
      let assignment = this.parentNode.parentNode.querySelector("#assign");
  
      if (assignment.innerHTML === "Unassigned") {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "assign.php?number=" + bkn, true);
        xhr.onload = function() {
          if (xhr.status == 200) {
            if (xhr.responseText === "success") {
                assignment.innerHTML = "Assigned";
                // set and display confirmation message
                let msg = document.getElementById("assignMsg");
                msg.innerText = `Booking request ${bkn} has been assigned!`;
                msg.style.display = "block";
            }
          }
        };
        xhr.send();
      }
    }
    // Display the table
    content.style.display = "block";
  }
  

// function to generate table with one object
function generateTableSingle(booking) {
    let content = document.getElementById("content");
    let table = document.getElementById("bookingTable");
    let row = `<tr>
                <td id="bkn">${booking.booking_number}</td>
                <td>${booking.customer_name}</td>
                <td>${booking.phone_number}</td>
                <td>${booking.suburb}</td>
                <td>${booking.destination_suburb}</td>
                <td>${booking.pick_up_date} ${booking.pick_up_time}</td>
                <td id="assign">${booking.assignment}</td>
                <td><button id="btn">Assign</button></td>
               </tr>`;
        table.innerHTML += row;

    // add event listener
    document.getElementById("btn").addEventListener("click", assign);
    function assign() {
        // if booking has a status of unassigned update the database to assigned and change in the table
        if (booking.assignment === "Unassigned"){
            let bkn = document.getElementById("bkn").innerHTML;
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "assign.php?number=" + bkn,true);
            xhr.onload = function () {
                if(xhr.status == 200) {
                    if (xhr.responseText === "success") {
                        //change table element to Assigned
                        document.getElementById("assign").innerHTML = "Assigned";
                        // set and display confirmation message
                        let msg = document.getElementById("assignMsg");
                        msg.innerText = `Booking request ${bkn} has been assigned!`;
                        msg.style.display = "block";
                    }
                }
            }
            xhr.send();
        }
    }
    // display table 
    content.style.display = "block";
}