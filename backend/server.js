const App=require('./src/App')
const connectDB=require('./src/db/db')
require('dotenv').config()
const PORT=process.env.PORT || 5000


connectDB();
if (process.env.NODE_ENV !== 'production') {
  App.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
  })
}

module.exports = App;  