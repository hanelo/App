const express = require('express');
const path = require('path');
const app = express();
const serverless = require('serverless-http');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/interface.html'));
});

app.post('/simulate', (req, res) => {
    const p = parseInt(req.body.passengers);
    const t = parseFloat(req.body.processing_time);
    const r = parseInt(req.body.num_resources);
    const pos = parseInt(req.body.chosen_position);

    if (p <= 0 || t <= 0 || r <= 0 || pos <= 0 || pos > p) {
        return res.sendFile(path.join(__dirname, '../views/interface.html'));
    }

    const processing_time = t;
    const waiting_time = 0;
    const total_time = waiting_time + processing_time;
    const chosen_waiting_time = pos === 1 ? 0 : (t / p) * (pos - 1);
    const chosen_total_time = chosen_waiting_time + t;
    const total_last = (p * t) / r;
    const wait_last = total_last - t;
    const wait_middle = wait_last / 2;
    const total_middle = wait_middle + t;
    const chosen_pos_wait = (t / r) * (pos - 1);
    const chosen_pos_total = chosen_pos_wait + t;
    const capacity = (r * 60) / t;

    res.render('result', {
        waiting_time,
        processing_time,
        total_time,
        first_passenger_processing_time: t,
        chosen_position_waiting_time: chosen_waiting_time,
        chosen_position_processing_time: t,
        chosen_position_total_time: chosen_total_time,
        last_passenger_waiting_time: wait_last,
        total_time_last_passenger: total_last,
        passenger_middle_waiting_time: wait_middle,
        total_time_middle_passenger: total_middle,
        passenger_chosenposition_waiting_time: chosen_pos_wait,
        passenger_chosenposition_total_time: chosen_pos_total,
        capacity
    });
});

module.exports = app;
module.exports.handler = serverless(app);
