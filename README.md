# COSC617 Backend

Using MongoDB
---
I recommend setting up [Mongodb Atlas](https://www.mongodb.com/cloud/atlas) as it is free and easy to setup for development purposes.  

Once you have the project cloned, add a `.env` file that looks something like:
```
MONGO_CONNECTION="connection string from mongodb atlas or localhost:27017 if you are running it locally on your machine"
DB_NAME="NameOfDatabase"
PORT=3000 (specifies that running the project will run the app at localhost:3000)
```  
Setting up for development
---
To install project dependencies, run `node install`.  
To run the app, run `node start`.  
*This app uses a module called nodemon which watches for changes in your files to restart the app automatically if you have autosave on.*
