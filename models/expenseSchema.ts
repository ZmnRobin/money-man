import mongoose, { Schema } from 'mongoose';

// Define the expense schema
const expenseSchema = new Schema({
  email: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category schema
  amount: { type: Number, required: true },
  month: { type: String, required: true} ,
  date: { type: Date, default: Date.now ,required: true},

});

// Index the email field to improve query performance
expenseSchema.index({ email: 1 });

// Create the Expense model
const Expense = mongoose.models?.Expense|| mongoose.model('Expense', expenseSchema);

export default Expense;
