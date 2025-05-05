const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventName = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn");
  const token = localStorage.getItem('token'); 

let today = new Date();
let activeDay = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();

todayBtn.addEventListener("click", () => {
  console.log("Today button clicked");
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  activeDay = today.getDate();
  initCalendar();
});

const months = [
  "january", "february", "march", "april",
  "may", "june", "july", "august",
  "september", "october", "november", "december"
];

const lang = localStorage.getItem('language') || 'en';

let eventsArr = [];

async function fetchEvents() {
  console.log("Fetching events...");
  try {
    const response = await fetch("http://localhost:8080/events", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error("Failed to fetch events");
    eventsArr = await response.json();
    console.log("Fetched events:", eventsArr);
    initCalendar();
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

fetchEvents();

function initCalendar() {
  console.log("Initializing calendar...");
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  console.log(`Month: ${months[month]} ${year}, First Day: ${firstDay}, Last Day: ${lastDay}`);

  date.innerHTML = `${window.translations[lang][months[month]]} ${year}`;
  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = eventsArr.some(eventObj => {
      const eventDate = new Date(eventObj.event_date); 
      return eventDate.getDate() === i && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });

    let activeClass = i === activeDay ? "active" : "";
    days += `<div class="day ${event ? 'event' : ''} ${activeClass}" data-day="${i}">${i}</div>`;
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  
  daysContainer.innerHTML = days;
  addListeners();
  getActiveDay(activeDay);
  updateEvents(activeDay);
}


function addListeners() {
  console.log("Adding listeners to days...");
  document.querySelectorAll(".day").forEach(day => {
    day.addEventListener("click", (e) => {
      console.log(`Day clicked: ${e.target.dataset.day}`);
      if (!e.target.classList.contains("prev-date") && !e.target.classList.contains("next-date")) {
        document.querySelectorAll(".day").forEach(day => day.classList.remove("active"));
        e.target.classList.add("active");
        activeDay = parseInt(e.target.dataset.day);
        getActiveDay(activeDay);
        updateEvents(activeDay);
      }
    });
  });
}

prev.addEventListener("click", () => {
  console.log("Previous month clicked");
  month--; 
  if (month < 0) { month = 11; year--; } 
  initCalendar(); 
});

next.addEventListener("click", () => {
  console.log("Next month clicked");
  month++; 
  if (month > 11) { month = 0; year++; } 
  initCalendar(); 
});

gotoBtn.addEventListener("click", () => {
  console.log("Go to date clicked");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2 && dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
    month = dateArr[0] - 1;
    year = parseInt(dateArr[1]);
    console.log(`Navigating to: ${months[month]} ${year}`);
    initCalendar();
  } else {
    alert("Invalid Date");
  }
});

function getActiveDay(date) {
  console.log(`Getting details for active day: ${date}`);
  const day = new Date(year, month, date);
  const dayName = day.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); 
  eventDay.innerHTML = window.translations[lang][dayName]; 
  eventDate.innerHTML = `${date} ${window.translations[lang][months[month]]} ${year}`;
}


function updateEvents(date) {
  console.log(`Updating events for: ${date}`);

  let events = eventsArr.filter(event => {
    const eventDate = new Date(event.event_date);
    return eventDate.getDate() === date && eventDate.getMonth() === month && eventDate.getFullYear() === year;
  });

  eventsContainer.innerHTML = events.length > 0 
    ? events.map(event => {
        const formattedStartTime = formatTime(event.start_time);
        const formattedEndTime = formatTime(event.end_time);
        return `
        <div class="event">
          <div class="title"><i class="fas fa-circle"></i> <h3 class="event-title">${event.name}</h3></div>
          <div class="event-time"><span>${formattedStartTime} to ${formattedEndTime}</span></div>
          <div class="delete-btn">
            <i class="fas fa-times" data-id="${event.id}" style="font-size: 2rem; color: var(--primary-clr); cursor: pointer;"></i>
          </div>
        </div>`;
      }).join('') 
    : '<div class="no-event"><h3>No Events</h3></div>';

  addDeleteEventListeners(); 
}

function formatTime(timeStr) {
  const [hours, minutes] = timeStr.split(':'); 
  let hour = parseInt(hours, 10);
  let ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; 
  return `${hour}:${minutes} ${ampm}`;
}

function addDeleteEventListeners() {
  console.log("Adding delete event listeners...");
  document.querySelectorAll(".delete-btn i").forEach(icon => {
    icon.addEventListener("click", async (e) => {
      const eventId = e.target.dataset.id;
      console.log(`Deleting event with ID: ${eventId}`);
      await deleteEvent(eventId); 
    });
  });
}

async function deleteEvent(eventId) {
  console.log("Deleting event with ID:", eventId);
  try {
    const response = await fetch(`http://localhost:8080/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to delete event");

    eventsArr = eventsArr.filter(event => event.id !== parseInt(eventId));

    updateEvents(activeDay);
    initCalendar();
    
  } catch (error) {
    console.error("Error deleting event:", error);
  }
}


addEventFrom.addEventListener("input", (e) => {
  console.log("Time input (from) changed:", e.target.value);
  let value = e.target.value.replace(/\D/g, "");
  if (value.length >= 2) value = value.slice(0, 2) + ":" + value.slice(2, 4);
  e.target.value = value;
});

addEventTo.addEventListener("input", (e) => {
  console.log("Time input (to) changed:", e.target.value);
  let value = e.target.value.replace(/\D/g, "");
  if (value.length >= 2) value = value.slice(0, 2) + ":" + value.slice(2, 4);
  e.target.value = value;
});

addEventBtn.addEventListener("click", () => {
  console.log("Add event button clicked");
  addEventWrapper.classList.add("active");
});

addEventCloseBtn.addEventListener("click", () => {
  console.log("Close add event form");
  addEventWrapper.classList.remove("active");
});

addEventSubmit.addEventListener("click", async () => {
  console.log("Submitting new event");
  const title = addEventName.value.trim();
  const fromTime = addEventFrom.value.trim();
  const toTime = addEventTo.value.trim();

  if (!title || !fromTime || !toTime) {
    alert("Please fill in all fields.");
    return;
  }

  if (!addEventName.value || !addEventFrom.value || !addEventTo.value || !eventDate) {
    console.error('All fields are required.');
    return; 
  }
  
  const startTime = addEventFrom.value;
  const endTime = addEventTo.value;
  
  
  const timePattern = /^([0-9]{2}):([0-9]{2})$/; 
  
  if (!timePattern.test(startTime) || !timePattern.test(endTime)) {
    console.error('Invalid time format. Use HH:mm format.');
    return;
  }
  
  const eventDateObj = new Date(year, month, activeDay);
  const formattedDate = eventDateObj.toISOString().split('T')[0];
  
  const newEvent = {
    name: addEventName.value, 
    event_date: formattedDate,
    start_time: addEventFrom.value, 
    end_time: addEventTo.value, 
};

try {
    const response = await fetch("http://localhost:8080/events", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newEvent)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to add event. Status: ${response.status}`);
    }
    const addedEvent = await response.json();
    console.log("Event added:", addedEvent);

    eventsArr.push(addedEvent);

    fetchEvents();

    addEventWrapper.classList.remove("active");
    alert("Event added successfully!");

} catch (error) {
    console.error("Error adding event:", error);
    alert("There was an error adding the event.");
}
});

