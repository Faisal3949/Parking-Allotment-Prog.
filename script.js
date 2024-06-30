angular.module('parkingApp', [])
.controller('ParkingController', function($scope) {
  $scope.vehicles = [];
  $scope.startTime = [];
  $scope.vehicleType = '';
  $scope.vehicleNumber = '';
  $scope.parkingSpace = '';


  // Regular expression for vehicle number validation (e.g., ABC-1234)
  const vehicleNumberPattern = /^[A-Z]{2}[0-9]{2}[A-HJ-NP-Z]{1,2}[0-9]{4}$/;


  // Generate parking spaces
  const columns = ['A', 'B', 'C'];
  const rows = [1, 2, 3, 4];
  $scope.availableSpaces = [];
  columns.forEach(col => {
    rows.forEach(row => {
      $scope.availableSpaces.push(`${col}-${row}`);
    });
  });

  $scope.createParkingSpace = function() {
    // Check if vehicle type, vehicle number, or parking space is empty
    if (!$scope.vehicleType || !$scope.vehicleNumber || !$scope.parkingSpace) {
      alert("*all fields are mandatory");
      return;
    }

             // Check if the vehicle number follows the pattern
    if (!vehicleNumberPattern.test($scope.vehicleNumber)) {
      alert("Enter the vehicle number properly");
      return;
    }

    // Check for duplicate vehicle numbers
    for (let i = 0; i < $scope.vehicles.length; i++) {
      if ($scope.vehicles[i].vehicleNumber === $scope.vehicleNumber.toUpperCase()) {
        alert("Vehicle number already exists. Enter a unique vehicle number.");
        return;
      }
    }




    //  duplicate parking spaces
    // for (let i = 0; i < $scope.vehicles.length; i++) {
    //   if ($scope.vehicles[i].parkingSpace === $scope.parkingSpace) {
    //     showModal("Parking space already occupied. Choose a different space.");
    //     return;
    //   }
    // }

    let date = new Date();
    let hour1 = date.getHours();
    let minutes1 = date.getMinutes();
    $scope.startTime.push({ hour1, minutes1 });

    let currentDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    let currentTime = hour1 > 12 ? `${hour1 - 12}:${minutes1} PM` : `${hour1}:${minutes1} AM`;

    let vehicle = {
      vehicleType: $scope.vehicleType,
      vehicleNumber: $scope.vehicleNumber.toUpperCase(),
      date: currentDate,
      time: currentTime,
      parkingSpace: $scope.parkingSpace
    };

    $scope.vehicles.push(vehicle);
    $scope.vehicleNumber = '';
    $scope.vehicleType = '';
    $scope.parkingSpace = '';





    // Remove occupied space from available spaces
    $scope.availableSpaces = $scope.availableSpaces.filter(space => space !== vehicle.parkingSpace);

    // Check if all spaces are occupied
    if ($scope.availableSpaces.length === 0) {
      Alert("Parking space Full.");
    }
  };



  // To remove the ParkingCard and bill generation.
  $scope.removeVehicle = function(index) {
    let end = new Date();
    let hour2 = end.getHours();
    let minutes2 = end.getMinutes();
    let hours1 = $scope.startTime[index].hour1;
    let totalHour = hour2 - hours1;
    let minutes1 = $scope.startTime[index].minutes1;
    let totalMinutes = minutes2 - minutes1;
    let totalTime = `${totalHour} hour and ${totalMinutes} minute`;
    let billNo = Math.trunc(Math.random() * 100000);

    let startTimeFormatted = hours1 > 12 ? `${hours1 - 12}:${minutes1} PM` : `${hours1}:${minutes1} AM`;
    let endTimeFormatted = hour2 > 12 ? `${hour2 - 12}:${minutes2} PM` : `${hour2}:${minutes2} AM`;

    showModal(`
      Bill Generated:<br>
      Bill No. ${billNo}<br>
      Thanks for Parking Here!<br>
      You parked here at ${startTimeFormatted}<br>
      And leave here at ${endTimeFormatted}<br>
      Your total time = ${totalTime}<br>
      And your total Bill is = ₹ ${(((totalHour * 60) + totalMinutes) / 60 * 20).toFixed(2)}   
    `);

    // Add back the parking space to available spaces
    $scope.availableSpaces.push($scope.vehicles[index].parkingSpace);

    $scope.vehicles.splice(index, 1);
    $scope.startTime.splice(index, 1);
  };

  function showModal(message) {
    const modal = document.getElementById('myModal');
    const modalBody = document.getElementById('modal-body');
    const span = document.getElementsByClassName('close')[0];
    const printButton = document.getElementById('printButton');

    modalBody.innerHTML = message;
    modal.style.display = 'block';

    span.onclick = function() {
      modal.style.display = 'none';
    };

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };

    printButton.onclick = function() {
      printBill(message);
    };
  }

  function printBill(content) {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Bill</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  }
});
