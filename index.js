import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 8080;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
})
);

app.listen(port, () => {
  console.log("Server stated on port " + port)
});