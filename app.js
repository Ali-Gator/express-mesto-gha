const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
// eslint-disable-next-line no-console
}).catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(PORT);
});
