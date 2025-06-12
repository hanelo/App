const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.render('interface');
});

app.post('/simulate', (req, res) => {
  const { passengers, processing_time, num_resources, chosen_position } = req.body;
  const np = parseInt(passengers);
  const pt = parseFloat(processing_time);
  const nr = parseInt(num_resources);
  const cp = parseInt(chosen_position);

  const waiting_time = 0;
  const processing = pt;
  const total_time = waiting_time + processing;

  const cp_wait = cp === 1 ? 0 : (pt / np) * (cp - 1);
  const cp_total = cp_wait + pt;

  const total_last = (np * pt) / nr;
  const last_wait = total_last - pt;
  const mid_wait = last_wait / 2;
  const mid_total = mid_wait + pt;
  const cp_waiting_time = (pt / nr) * (cp - 1);
  const cp_total_time = cp_waiting_time + pt;
  const capacity = (nr * 60) / pt;

  res.render('result', {
    waiting_time,
    processing_time: processing,
    total_time,
    chosen_position_waiting_time: cp_wait,
    chosen_position_total_time: cp_total,
    last_passenger_waiting_time: last_wait,
    total_time_last_passenger: total_last,
    passenger_middle_waiting_time: mid_wait,
    total_time_middle_passenger: mid_total,
    passenger_chosenposition_waiting_time: cp_waiting_time,
    passenger_chosenposition_total_time: cp_total_time,
    capacity
  });
});

module.exports = app;
