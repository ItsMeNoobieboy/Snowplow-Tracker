<template>
  <div class="plowbg">
    <!-- Display the user that's signed in -->
    <p>Logged in as {{id}}</p>
    <button @click="toggleTracking">    
      {{ tracking ? "Stop Tracking" : "Start Tracking" }} 
    </button>
    <!-- Make a table of their previous locations -->
    <div v-if="tracking">
      <h1>Previous Locations</h1>
      <table>
        <tr>
          <th>Latitude</th>
          <th>Longitude</th>
        </tr>
        <!-- <tr v-for="loc in locations.slice(0, 10)" :key="loc">
          <td>{{loc._lat}}</td>
          <td>{{loc._long}}</td>
        </tr>
        <tr v-if="locations.length >= 10">
          <td>...</td>
          <td>...</td>
        </tr> -->
      </table>
      </div>
  </div>
</template>

<script setup>
const { ref } = require("@vue/reactivity");
const { onMounted } = require("@vue/runtime-core");

let tracking = ref(false);
let locations = ref([]);

let lastSet = -1;
let lastPos = null;
let id;

const toggleTracking = () => {
  tracking.value = !tracking.value;
  if(tracking.value){
    updateUserPos();
  }
}

const updateUserPos = () => {
  if(!tracking.value) return;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((e) => {
      let latitude = e.coords.latitude;
      let longitude = e.coords.longitude;

      // round latitude and longitude to 7 decimal places
      latitude = Math.round(latitude * 10000000) / 10000000;
      longitude = Math.round(longitude * 10000000) / 10000000;

      if(lastPos != null){
        if(lastPos.lat == latitude && lastPos.lng == longitude){
          return;
        }
      }
      locations.value.push(lastPos);

      lastSet++;
      // add the user's location to the database
      window.ws.send(JSON.stringify({
        id: id,
        lat: latitude,
        lng: longitude,
        lastSet: lastSet + 1,
        [lastSet]: {
          lat: latitude,
          lng: longitude
        }
      }))

      lastPos = {
        lat: latitude,
        lng: longitude
      }
    });
  } else { 
    console.log("Geolocation is not supported or enabled by this browser.");
  }
  setTimeout(updateUserPos, 5000);
}

onMounted(updateUserPos)

// have a popup asking for the user's id
let lsid = localStorage.getItem("id");
if(!lsid || lsid == "" || lsid == null){
  id = prompt("What's your name?").trim().toLowerCase();
  while (id == null || id == "") {
    id = prompt("Please enter a name").trim().toLowerCase();
  }
  localStorage.setItem("id", id);
}else{
  id = localStorage.getItem("id");
}

// check if the websocket is open
if(window.ws.readyState == 1){
  // send a message to the server to get the user's id
  window.ws.send(JSON.stringify({
    id: id,
    request: "me"
  }))
}else{
  // wait for the websocket to open
  window.ws.addEventListener("open", () => {
    window.ws.send(JSON.stringify({
      id: id,
      request: "me"
    }))
  })
}
</script>

<style scoped>
.plowbg {
  height: 100%;
  color: rgb(0,0,133);
  background-color: rgb(255, 255, 255);
  background-image: url('../assets/bg3.jpg');
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
}
button {
  margin-top: 15%;
  width: 40%;
  background-color: rgb(217,235,238);
  color: rgb(0,0,133);
  padding: 1rem;
  border-radius: 1rem;
  border: 3px solid white;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 1.5rem;
  transition: transform 0.2s;
}
button:hover{
  cursor: pointer;
  transform: scale(1.1);
}
table {
  width: 100%;
  color: black;
}
th, td {
  background-color: rgba(255, 255, 255, 0.8);
  width: 30vw;
}
</style>