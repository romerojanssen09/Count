document.addEventListener("DOMContentLoaded", function () {
  reloadTasks();
});
function addTime() {
  var timeinInput = document.getElementById('timein');
  var timeoutInput = document.getElementById('timeout');
  var timein = timeinInput.value;
  var timeout = timeoutInput.value;
  if (timein === '' || timeout === ''){
    if(timein === ''){
      timeinInput.style.border = "1px solid red";
    } else {
      timeinInput.style.border = "1px solid black";
    }
    if(timeout === ''){
      timeoutInput.style.border = "1px solid red";
    } else {
      timeoutInput.style.border = "1px solid black";
    }
  } else {
    timeoutInput.style.border = "1px solid black";
    timeinInput.style.border = "1px solid black";
    var timeinMinutes = convertToMinutes(timein);
    var timeoutMinutes = convertToMinutes(timeout);
    // Adjust timeoutMinutes for cases where timeout is before timein (crosses midnight)
    if (timeoutMinutes < timeinMinutes) {
      timeoutMinutes += 24 * 60; // add 24 hours in minutes
    }
    var totalTime = timeoutMinutes - timeinMinutes;
    var timeGap = Math.abs(timeinMinutes - timeoutMinutes);
    var taskList = document.getElementById("ul");  
    var li = document.createElement("li");
    li.innerHTML = '<p>Timein:'+formatTime(timein)+'  </p> <p>  Timeout: '+formatTime(timeout)+'</p> <p>Time Gap: '+formatTotalTime(timeGap)+'</p> <button class="remove-button" onclick="removeList(this, '+timeGap+')">remove</button><br/>';
    // Insert the new li at the beginning of the list
    taskList.appendChild(li);
    totalCount += timeGap;
    totalTimeinCount();
    timeinInput.value = "";
    timeoutInput.value = "";
    
    storeTasks();
  }
}
function formatTotalTime(totalTime) {
  var hours = Math.floor(totalTime / 60);
  var minutes = totalTime % 60;
  if(hours === 0){
    return (minutes < 10 ? '0' : '') + minutes + 'min';
  } else {
    return hours + 'hr ' + (minutes < 10 ? '0' : '') + minutes + 'min';
  }
}
function removeList(button, timeToRemove){
  var taskList = document.getElementById("ul");
  var li = button.parentNode;
  taskList.removeChild(li);
  totalCount -= timeToRemove;
  totalTimeinCount();
  storeTasks();
}
var totalCount = 0;
function totalTimeinCount() {
  var total = document.getElementById('total');
  var hours = Math.floor(totalCount / 60);
  var minutes = totalCount % 60;
  if (hours === 0) {
    total.textContent = (minutes < 10 ? '0' : '') + minutes + 'min';
  } else {
    total.textContent = hours + 'hr ' + (minutes < 10 ? '0' : '') + minutes + 'min';
  }
}
function formatTime(time) {
  var parts = time.split(':');
  var hours = parseInt(parts[0], 10);
  var minutes = parseInt(parts[1], 10);
  var period = hours < 12 ? 'AM' : 'PM';
  // Adjust hours for cases where it is midnight
  hours = hours % 12 || 12;
  if (hours === 0) {
    return '12:' + (minutes < 10 ? '0' : '') + minutes + ' ' + period;
  } else {
    var formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes;
    return formattedTime + ' ' + period;
  }
}
function convertToMinutes(time) {
  var parts = time.split(':');
  var hours = parseInt(parts[0], 10);
  var minutes = parseInt(parts[1], 10);
  return hours * 60 + minutes;
}
function storeTasks(){
  var taskList = document.getElementById("ul");
  var tasks = Array.from(taskList.children).map(li=>li.innerHTML);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function reloadTasks() {
  var taskList = document.getElementById("ul");
  var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  totalCount = 0; // Reset totalCount
  tasks.reverse().forEach(tasksText => {
    var li = document.createElement("li");
    li.innerHTML = tasksText;
    taskList.appendChild(li);
    // Extract timeGap from li.innerHTML and update totalCount
    var timeGapMatch = /removeList\(this, (\d+)\)/.exec(tasksText);
    if (timeGapMatch) {
      totalCount += parseInt(timeGapMatch[1], 10);
    }
  });
  totalTimeinCount();
}
function checker() {
  var timeinInput = document.getElementById("timein");
  var timeoutInput = document.getElementById("timeout");
  if (timeinInput.value !== null && timeinInput.value !== "") {
    timeinInput.style.border = "1px solid black";
  } else {
    timeinInput.style.border = "1px solid red";
  }
  if (timeoutInput.value !== null && timeoutInput.value !== "") {
    timeoutInput.style.border = "1px solid black";
  } else {
    timeoutInput.style.border = "1px solid red";
  }
}