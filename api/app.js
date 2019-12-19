'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const UserController = require('./src/controller');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// get user list
app.get('/list', async (req, res) => {
  const date = moment().format('YYYY-MM-DD');
  const data = await UserController.getPrizeCounts(date);
  res.send(
    JSON.stringify({
      code: 0,
      data,
    }),
  );
});

// add new user
app.post('/prize', async (req, res) => {
  let result = '';
  const user = req.body;
  const curTime = moment();
  user.date = curTime.format('YYYY-MM-DD');
  user.datetime = curTime.valueOf();
  try {
    if (!user.uid || !user.prizeId) {
      result = {
        code: 1010,
        data: false,
        message: 'Invalid Parameter.',
      };
    }
    const got = await UserController.getPrizeByUid(
      user.uid,
      user.prizeId,
      user.date,
    );
    if (got) {
      result = {
        code: 1005,
        data: {},
        message: 'You have got this prize.',
      };
    } else {
      const data = await UserController.createUser(user);
      result = {
        code: 0,
        data,
        message: 'Insert Success',
      };
    }
  } catch (e) {
    result = {
      code: e.code,
      message: `Insert Fail: ${e.message}`,
    };
  }

  res.send(JSON.stringify(result));
});

module.exports = app;
