import mongoose, { Schema} from 'mongoose';

// Define the category schema
const categorySchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['expense', 'income'], required: true }
});

// Index the email field to improve query performance
categorySchema.index({ email: 1 });

// Create the Category model
const Category = mongoose.models?.Category||mongoose.model('Category', categorySchema);

export default Category;
