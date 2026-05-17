const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Usamos uma variável de ambiente MONGODB_URI que você configurará no Vercel
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nutriguide';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState;
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
  }
};

// --- Schemas ---

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  age: Number,
  weight: Number,
  height: Number,
  gender: String,
  token: String,
  created_at: { type: Date, default: Date.now },
});

const healthMetricsSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  bmi: Number,
  bmr: Number,
  hydration_goal: { type: Number, default: 2500 },
  hydration_current: { type: Number, default: 0 },
  body_fat_percentage: Number,
  tdee: Number,
  updated_at: { type: Date, default: Date.now },
});

const habitsSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  date: { type: String, required: true },
  water: { type: Boolean, default: false },
  exercise: { type: Boolean, default: false },
  healthy_food: { type: Boolean, default: false },
  sleep: { type: Boolean, default: false },
  supplements: { type: Boolean, default: false },
});
habitsSchema.index({ user_id: 1, date: 1 }, { unique: true });

const calculatorHistorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: Number, required: true },
  label: { type: String, required: true },
  date: { type: String, required: true },
  inputs: { type: mongoose.Schema.Types.Mixed },
});

// Cache the models so Vercel serverless functions don't try to redefine them
const User = mongoose.models.User || mongoose.model('User', userSchema);
const HealthMetrics = mongoose.models.HealthMetrics || mongoose.model('HealthMetrics', healthMetricsSchema);
const Habit = mongoose.models.Habit || mongoose.model('Habit', habitsSchema);
const CalculatorHistory = mongoose.models.CalculatorHistory || mongoose.model('CalculatorHistory', calculatorHistorySchema);

module.exports = { connectDB, User, HealthMetrics, Habit, CalculatorHistory };
