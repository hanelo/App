import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

// Pour résoudre __dirname en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('interface');
});

app.post('/simulate', (req, res) => {
  try {
    const { passengers, processing_time, num_resources, chosen_position } = req.body;

    const p = parseInt(passengers);
    const t = parseFloat(processing_time);
    const r = parseInt(num_resources);
    const pos = parseInt(chosen_position);

    const waiting_time = 0;
    const total_time = t;
    const first_passenger_processing_time = t;
    const chosen_position_waiting_time = pos === 1 ? 0 : (t / p) * (pos - 1);
    const chosen_position_total_time = chosen_position_waiting_time + t;
    const total_time_last_passenger = (p * t) / r;
    const last_passenger_waiting_time = total_time_last_passenger - t;
    const passenger_middle_waiting_time = last_passenger_waiting_time / 2;
    const total_time_middle_passenger = passenger_middle_waiting_time + t;
    const passenger_chosenposition_waiting_time = (t / r) * (pos - 1);
    const passenger_chosenposition_total_time = passenger_chosenposition_waiting_time + t;
    const capacity = (r * 60) / t;

    res.render('result', {
      capacity,
      waiting_time,
      total_time,
      first_passenger_processing_time,
      chosen_position_waiting_time,
      chosen_position_total_time,
      processing_time: t,
      total_time_last_passenger,
      last_passenger_waiting_time,
      passenger_middle_waiting_time,
      total_time_middle_passenger,
      passenger_chosenposition_waiting_time,
      passenger_chosenposition_total_time
    });
  } catch (e) {
    res.render('interface', { error: 'Erreur de simulation.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
