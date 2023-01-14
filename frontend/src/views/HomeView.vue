<template>
  <div ref="mapRef" style="width: 100%; height: calc(100% - 42.4px)"></div>
</template>
 
<script setup>
import { ref, onMounted } from 'vue'
import MapRenderer from './../components/MapRenderer.vue';

const mapRef = ref(null)
let map = null
let plows = []

class Plow {
  constructor(...args){
    // copy the args into the object
    Object.assign(this, ...args)
  }
  updatePoint(){
    if(this.lastLat == this.lat && this.lastLng == this.lng) return
    if(this._point){
      this._point.setMap(null)
      this._point = null
    }
    this._point = new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map: map,
      icon: {
        url: './snoplow2.png',
        scaledSize: new google.maps.Size(50, 50)
      },
      title: this.id
    })
  }
  updateRoad(){
    if(this.lastLat == this.lat && this.lastLng == this.lng) return
    if(this._road){
      this._road.setMap(null)
    }
    let road = []
    for(let i = 0; i <= this.lastSet; i++){
      if(!this[i]) continue;
      road.push({
        lat: this[i].lat,
        lng: this[i].lng
      })
    }

    this._road = new google.maps.Polyline({
      path: road,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    })

    this._road.setMap(map)
  }
  updateValues(vals){
    Object.assign(this, vals)
  }
}

const updatePlow = (data) => {
  let plow = plows.find(plow => plow.id == data.id)
  if(!plow){
    plow = new Plow(data)
    plows.push(plow)
  }
  plow.updateValues(data)
  plow.updatePoint()
  plow.updateRoad()
}

const updatePlows = (data) => {
  data = JSON.parse(data.data)
  if(data.type == "update") return updatePlow(data)
  if(data.type == "response") return
  let plowNames = Object.keys(data)
  for(let plowName of plowNames){
    let plow = data[plowName]
    plow.name = plowName
    plow = new Plow(plow)
    plow.updatePoint()
    plow.updateRoad()
    plows.push(plow)
  }
}

window.ws.onmessage = updatePlows;

onMounted(() => { 
  let pos = { 
    lat: 42.37142140336701,
    lng: -71.13754645025334
  }

  // Import the Google Maps API
  map = new google.maps.Map(mapRef.value, {
    zoom: 16,
    center: pos
  });
})

</script>

<style scoped>

</style>