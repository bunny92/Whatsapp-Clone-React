import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import Messages from "./dbMessages.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8000;
const pusher = new Pusher({
  appId: "1070564",
  key: "51971f6645c528acd3d2",
  secret: "1d06ecc392707037f73a",
  cluster: "ap2",
  encrypted: true,
});

app.use(express.json());
app.use(cors());

const connectionUrl =
  "mongodb+srv://admin:r5k2KKqS3yKEr6dh@cluster0.tiydj.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connectionUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB Connected");

  const messageCollection = db.collection("messagecontents");
  const changeStream = messageCollection.watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        message: messageDetails.message,
        name: messageDetails.name,
        timeStamp: messageDetails.timeStamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error Trigger in pusher");
    }
  });
});

app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages/sync", (req, res) => {
  const dbMessage = req.body;
  Messages.find(dbMessage, (err, data) => {
    err ? res.status(500).send(err) : res.status(200).send(data);
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;
  Messages.create(dbMessage, (err, data) => {
    err ? res.status(500).send(err) : res.status(201).send(data);
  });
});

app.listen(port, console.log(`Port is Listing http://localhost:${port}`));
