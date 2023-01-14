const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

let plows = {};

wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		let data = JSON.parse(message);
		if(data.request == "me"){
			ws.send(JSON.stringify({
				type: "response",
				...plows[data.id]
			}))
			return;
		}
		plows[data.id] = {
			...plows[data.id],
			...data
		}
		wss.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify({
					type: "update",
					...plows[data.id]
				}));
			}
		});
	})
	ws.send(JSON.stringify(plows));
});