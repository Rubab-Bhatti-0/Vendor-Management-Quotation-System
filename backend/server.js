const App=require('./src/App')
const connectDB=require('./src/db/db')
require('dotenv').config()
const PORT=process.env.PORT || 3000


connectDB();

App.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
