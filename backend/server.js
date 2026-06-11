import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import orderRouter from './routes/orderRoute.js'
import cartRouter from './routes/cartRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import homepageImageRouter from './routes/homepageImageRoute.js'
import firmContentRouter from './routes/firmContentRoute.js'
import aboutContentRouter from './routes/aboutContentRoute.js'
import inquiryRouter from './routes/inquiryRoute.js'


// App config //
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares //
app.use(express.json())
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174', 
      'http://localhost:3000',
      'https://nemi-laxura-frontend.vercel.app',
      'https://luxura-eight.vercel.app',
      'https://luxurafrontend.vercel.app',
      'https://luxuraadmin.vercel.app',
      'https://nemi-laxura-admin.vercel.app'
    ];
    
    // Allow all Vercel deployments (for admin panel and other deployments)
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'X-Requested-With']
}))

// api endpoints //
app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/orders',orderRouter);
app.use('/api/cart',cartRouter);
app.use('/api/review',reviewRouter);
app.use('/api/homepage',homepageImageRouter);
app.use('/api/firm',firmContentRouter);
app.use('/api/about',aboutContentRouter);
app.use('/api/inquiries',inquiryRouter);

app.get('/',(req,res)=>{
    res.send("API Working");
})

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Export app for Vercel
export default app

// Listen only if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(port,()=>{
        console.log("server started on PORT : " + port);
    })
}