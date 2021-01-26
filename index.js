const express = require('express')

const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
const port = 5000

app.use(cors());
app.use(bodyParser.json());




const admin = require("firebase-admin");
require('dotenv').config();

console.log(process.env.DB_PASS)


var serviceAccount = require("./burj-al-arab-6b012-firebase-adminsdk-czeji-0e1ff09c98.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l8f7z.mongodb.net/burjAlArab?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("burjAlArab").collection("bookings");
  
  
app.post('/addBooking', (req,res)=>{
    const newBooking = req.body ;

    collection.insertOne(newBooking)
    .then(result =>{
        res.send(result.insertedCount > 0);
    })

    console.log(newBooking)
})

app.get('/bookings',(req,res)=>{
    
const bearer  = req.headers.authorization ; 

    if (bearer&& bearer.startsWith('Bearer ')){
        const idToken = bearer.split(' ')[1];
        console.log({idToken})

        admin
  .auth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    const tokenEmail = decodedToken.email;
    const queryEmail = req.query.email;
    if(tokenEmail == queryEmail){
        collection.find({email : queryEmail})
        .toArray((err,documents)=>{
            res.status(200).send(documents)
        })
    }
    else {

        res.status(401).send('Un Authorized access')
    
            }
  })
  .catch((error) => {
    res.status(401).send('Un Authorized access')
  });
}

else {

    res.status(401).send('Un Authorized access')

        }

})

});







app.get('/',(req,res)=>{
    res.send('Hello !!!')
})

app.listen(port)