const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Load env vars
dotenv.config();

const app = express();

// Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'AFALM Auth API',
      version: '1.0.0',
      description: 'API Documentation for AFALM Authentication Backend'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
const predictionRoutes = require('./routes/predictionRoutes');
app.use('/api/predictions', predictionRoutes);
const soilPredictionRoutes = require('./routes/soilPredictionRoutes');
app.use('/api/soil-predictions', soilPredictionRoutes);

app.get('/', (req, res) => {
  res.send('AFALM Auth Backend API is running...');
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/afalm')
.then(() => {
  console.log('MongoDB Connected Successfully');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
