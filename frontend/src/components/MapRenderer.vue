<template>
	
</template>

<script setup>
import { watch } from "@vue/runtime-core"

let props = defineProps(['map', 'roads', 'plows'])

watch(() => props.map, () => {
	updatePolyLines()
	updatePlows()
})
watch(() => props.roads, updatePolyLines, { deep: true })
watch(() => props.plows, updatePlows, { deep: true })

let roads = []

function updatePolyLines(){
	for(let road of roads){
		road.setMap(null)
	}
	roads = []
	if(!props.map) return
	for(let road of props.roads){
		let path = new google.maps.Polyline({
			path: road,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		})
		path.setMap(props.map)
		roads.push(path)
	}
}

let plows = []
function updatePlows(){
	// for all plows that haven't moved, don't update them
	for(let plow of plows){
		plow.setMap(null)
	}
	plows = []
	if(!props.map) return
	for(let plow of props.plows){
		let marker = new google.maps.Marker({
			position: plow,
			map: props.map,
			icon: {
				url: './snoplow2.png',
				scaledSize: new google.maps.Size(50, 50)
			},
			title: plow.name
		})
		plows.push(marker)
	}
}
</script>