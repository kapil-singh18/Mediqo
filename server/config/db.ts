import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  if (isConnected && mongoose.connection.readyState === 1) return true;

  // Disable bufferCommands globally so Mongoose immediately throws on model queries if not connected
  mongoose.set('bufferCommands', false);
  mongoose.set('strictQuery', true);

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mediqo';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log('MongoDB Connected successfully to:', uri);
    return true;
  } catch (error: any) {
    console.warn('MongoDB Connection Notice:', error.message || error);
    console.warn('Backend operating with managed active datastore.');
    isConnected = false;
    return false;
  }
};

export const getIsDbConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};
