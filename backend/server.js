const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configuración del servidor
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/reservas', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión exitosa con MongoDB');
  } catch (err) {
    console.error('Error al conectar con MongoDB:', err);
  }
}

connectDB(); // Llamada a la función de conexión

// Esquema de la base de datos
const reservaSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  mode: String,
  date: Date,
  message: String,
});

const Reserva = mongoose.model('Reserva', reservaSchema);

// Ruta para recibir reservas
app.post('/api/reservas', async (req, res) => {
  try {
    const nuevaReserva = new Reserva(req.body);
    await nuevaReserva.save();
    res.status(201).json({ message: 'Reserva registrada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la reserva' });
  }
});

// Ruta para obtener reservas
app.get('/api/reservas', async (req, res) => {
  try {
    const reservas = await Reserva.find();
    console.log('Reservas obtenidas desde MongoDB:', reservas); // Agrega este log
    res.status(200).json(reservas);
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});