const mongoose = require('mongoose');
require('dotenv').config();
const Topic = require('./models/Topic');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const res = await Topic.updateMany(
      { isCompleted: true, completedAt: { $exists: false } },
      { $set: { completedAt: new Date() } }
    );
    console.log('Fixed topics:', res);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
