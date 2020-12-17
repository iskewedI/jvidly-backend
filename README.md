## The URL endpoint to this Api => 
#### https://jvidly-backend.herokuapp.com/
## Try it!
- POST on https://jvidly-backend.herokuapp.com/api/users with body: { name, email, password } => Create your User
- Then, get the x-auth-token header property 
- POST on https://jvidly-backend.herokuapp.com/api/genres with the x-auth-token header and body: { name } 
- GET on https://jvidly-backend.herokuapp.com/api/genres and you'll see your genre in the database!! 

### Tools & Technologies learned by doing this project:
- RESTful API with **Node** and **Express**.
- Connection to the Mongo database done with **Mongoose**.
- Encryption of passwords with **bcrypt**.
- Structuring the project with configs files for different environments with **config**
- Managing of JWT with **jsonwebtoken**
- Validating data with **Joi** 
- Logging and handling exceptions with **winston** 
- Handling async functions errors with **express-async-errors*
- Improved performance with **compression** to production environment
- Secured app with **Helmet**
- Unit testing with **Jest** & Integration testing with **Supertest**
- Other useful tools used like **joi-objectid** & **lodash** & **moment** & **nodemon** 
