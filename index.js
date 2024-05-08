const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//> remove before deployment
const os = require("os");
function getLocalIP() {
	const interfaces = os.networkInterfaces();
	const addresses = [];
	for (let k in interfaces) {
		for (let k2 in interfaces[k]) {
			const address = interfaces[k][k2];
			if (address.family === "IPv4" && !address.internal) {
				addresses.push(address.address);
			}
		}
	}
	return addresses[0];
}
const ip = process.env.IP || getLocalIP();
//

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zxotz8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		// await client.connect();

		const serviceCollection = client.db("m58carDoctor").collection("services");

		app.get("/services", async (req, res) => {
			const cursor = serviceCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});

		app.get("/services/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };

			const options = {
				// Include only the `title` and `imdb` fields in the returned document
				projection: { title: 1, price: 1, service_id: 1 },
			};

			const result = await serviceCollection.findOne(query, options);
			res.send(result);
		});

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	// res.send("server is running");
	res.send(`http://${ip}:${port}`); //> remove before deployment
});

app.listen(port, ip, () => {
	// console.log(`Server is listening on port ${port}`);
	console.log(`http://${ip}:${port}`); //> remove before deployment
});
