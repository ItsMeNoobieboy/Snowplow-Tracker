const fs = require('fs');
const WebSocket = require('ws');

const routes = JSON.parse(fs.readFileSync('test_routes.json', 'utf8'));

const ws = new WebSocket('ws://localhost:3000');

class Plow {
	constructor(id, route) {
		this.id = id;
		this.route = route;
		this.currentNode = 0;
		this.routePercent = 0;
	}
	getGeopoint() {
		const route = this.route;
		const index = this.currentNode;
		const pos = route[index];
		const target = route[index+1];

		// interpolate between pos and target
		const lat = pos.lat + (target.lat - pos.lat) * this.routePercent;
		const lng = pos.lng + (target.lng - pos.lng) * this.routePercent;

		return {lat, lng}
	}
	update() {
		let { lat, lng } = this.getGeopoint();

		// update the route percent based on the distance between the current node and the next node
		const route = this.route;
		const index = this.currentNode;
		const pos = route[index];
		const target = route[index+1];
		const distance = Math.sqrt(Math.pow(target.lat - pos.lat, 2) + Math.pow(target.lng - pos.lng, 2));
		this.routePercent += 0.1 / distance;

		// db.collection('boston').doc(this.id).set(data, { merge: true });
		ws.send(JSON.stringify({
			id: this.id,
			lat,
			lng,
			lastSet: this.currentNode+1,
			[this.currentNode+1]: {lat, lng}
		}));


		if(this.routePercent >= 1) {
			this.routePercent = 0;
			this.currentNode++;
			if(this.currentNode >= this.route.length - 1) {
				this.currentNode = 0;
				return;
			}
		}
		
		setTimeout(() => this.update(), 1000);
	}
	start(){
		// db.collection('boston').doc(this.id).set({
		// 	'0': this.getGeopoint(),
		// 	location: this.getGeopoint(),
		// 	lastSet: 0
		// })
		this.update();
	}
}

const names = ['Larry', 'Curly', 'Moe', 'Shemp', 'Ryan', 'Andrew', 'Joanne', 'Bill']

let plows = []
for(let i = 0; i < routes.length; i++){
	plows.push(new Plow(names[i], routes[i]));
}

ws.onopen = () => {
	for(let plow of plows) {
		plow.start();
	}
}

/*
// update the list of roads
// comma = %2C, pipe = %7C
let query = ""

for(let i = 0; i < doc.data().lastSet; i++){
let lat = doc.data()[i]["_lat"]
let lng = doc.data()[i]["_long"]
query += `${lat}%2C${lng}%7C`
}
query += `${doc.data()[doc.data().lastSet]["_lat"]}%2C${doc.data()[doc.data().lastSet]["_long"]}`
let url = `https://roads.googleapis.com/v1/snapToRoads?interpolate=true&path=${query}&key=AIzaSyDMW8aosJSw6u_Rp_H8Asee_MdZe61VCEs`
fetch(url)
.then(res => res.json())
.then(data => {
roads.value.push([])
let points = data.snappedPoints
for(let i = 0; i < points.length; i++){
	roads.value[roads.value.length-1].push({
	lat: points[i].location.latitude,
	lng: points[i].location.longitude
	})
}
console.log(roads.value)
})
.catch(error => {
console.log(error)
})*/