'use strict';

const { Client } = require('pg');

function ApiError(code, msg) {
  const e = new Error(msg);
  e.code = code;
  return e;
}

const DB_NAME = 'gmtc';
const prizeLimitMap = {
  1: 10,
  2: 10,
  3: 10,
  4: 10,
};

// init mysql connection
function initPgClient() {
  const client = new Client({
    connectionString: `${process.env.PG_CONNECT_STRING}/${DB_NAME}`,
  });
  client.connect();

  // init table
  client.query(`CREATE TABLE IF NOT EXISTS users (
    uid TEXT NOT NULL,
    prizeId  TEXT NOT NULL,
    date  TEXT NOT NULL,
    datetime  TEXT NOT NULL
  );`);

  return client;
}

const client = initPgClient();

module.exports = {
  /**
   * get prize
   * @param {object} user user info
   */
  async createUser(user) {
    try {
      const { uid, prizeId, date, datetime } = user;
      let prizeCounts = await this.getPrizeCounts(date);
      let curPrizeCount = prizeCounts[prizeId];

      const curPrizeLimit = prizeLimitMap[prizeId];
      if (curPrizeCount.length >= curPrizeLimit) {
        return false;
      }
      const { rowCount } = await client.query({
        text:
          'INSERT INTO users(uid, prizeId, date, datetime) VALUES($1, $2, $3, $4)',
        values: [uid, prizeId, date, datetime],
      });
      if (rowCount === 1) {
        if (curPrizeCount.length === 0) {
          return true;
        }
        // handler parallel request condition
        // if insert success, but 
        prizeCounts = await this.getPrizeCounts(date);
        curPrizeCount = prizeCounts[prizeId];
        for (let i = 0, len = curPrizeCount.length; i < len; i++) {
          const item = curPrizeCount[i];
          if (item.uid === uid && i < curPrizeLimit) {
            return true;
          }
        }
        return false;
      }
      return false;
    } catch (e) {
      throw new ApiError(1001, e);
    }
  },
  async getPrizeByUid(uid, prizeId, date) {
    try {
      const { rows } = await client.query({
        name: 'fetch-prizes',
        text:
          'SELECT * FROM users WHERE uid = $1 and prizeid = $2 and date = $3',
        values: [uid, prizeId, date],
      });
      const len = rows.length;
      if (len > 0) {
        return true;
      }
      return false;
    } catch (e) {
      throw new ApiError(1002, e);
    }
  },
  /**
   * get prize counts
   * @param {string} date today date
   */
  async getPrizeCounts(date) {
    try {
      const { rows } = await client.query({
        name: 'fetch-prize-counts',
        text: 'SELECT * FROM users WHERE date = $1',
        values: [date],
      });
      const prizeCounts = {};
      Object.keys(prizeLimitMap).forEach((key) => {
        prizeCounts[key] = [];
      });
      const len = rows.length;
      if (len > 0) {
        rows.forEach((item) => {
          item.prizeId = item.prizeid;
          prizeCounts[item.prizeId].push(item);
        });
      }
      return prizeCounts;
    } catch (e) {
      throw new ApiError(1002, e);
    }
  },
};
