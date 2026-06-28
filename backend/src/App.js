const express=require('express')
const cors=require('cors')
const vendorRoutes = require('./routes/vendor.routes');
const quotationRoutes = require('./routes/quotation.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const App=express()
App.use(cors({
  origin: '*'  // Vite's default port
}));
App.use(express.json());


App.use('/api/vendors', vendorRoutes);
App.use('/api/quotations', quotationRoutes);
App.use('/api/dashboard', dashboardRoutes);

App.use(errorHandler);

module.exports=App