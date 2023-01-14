# Snowplow Tracker (Demo)

This project was created for the BB&N hackathon 2023. It is a web app that would allow users to track in realtime the location of snowplows in their area. It provides a way to tell whether or not a street has recently been cleared, which would provide utility to people who need to get to work or school, or to snowplow drivers who need to know where to go next.

### How to run

1. Clone the repository
2. Open a terminal inside of /backend
3. Run `npm install`
4. Run `node index.js`
5. Open a terminal inside of /frontend
6. Run `npm install`
7. Run `npm run serve`
8. Open a browser and go to `localhost:8080`

At this point, there will be a functional map, but without and snowplows. To add in demonstration snowplows, do the following:

9. Open a terminal inside of /backend
10. Run `node testplows.js`

This will add 5 snowplows, all in the vicinty of the BB&N campus. They will move around randomly, and you can see their paths on the map.