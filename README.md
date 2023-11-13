
# Vault Guard: A Demo Bank App
A demo bank-app that does not involve real money, but involves the customers making "money" transfers and viewin transaction-history.
<br />

# Technologies
- **React.js + typescript(already compiled an placed in *public* directory**
- **Express.js + typescript**

## Roles
- **Administrator**: the modulator of the app, responsible for creating new customer-accounts and management of some other customer-activities;
- **Customer**: an account-owner that can make money transfers and view transactions-history.
<br />


> Read through the file in **docs directory** to fully comprehend the use-cases of the app from the perspective of both roles


# Requirements for Running the App
- npx
- npm (version 7.19.1)
- mongodb (version 6.0.2)
<br />

> **Note: make sure you create a .env file and define the following variables in it:**
> - JWT_KEY=kjscxqioecnqckjcsaam
> - DB_SERVER=localhost:27017
> - DB=BankAppDB=BankApp
> - ADMIN_DEFAULT_PASSWORD=admin 

# Running the app
- download the project with **`git clone`**
- install all the dependencies with **`git install`**
- run the app with **`npm run start:dev`**


# Only the Client has a Frontend-view
To view the client's front-end, open [http://localhost:3000](http://localhost:3000) in the browser, after running the app.
<br />

# Access the Admin's perspective with Postman
- seed the admin's info into the db with: *node ./dist/db/seeders/seedAdmins.js*
- login to the admin with the following URI: '/api/login' 

# Contacting Me For guidance
For guidance on using the app optimally, as specified in the file in the **doc directory**, you can chat me up on whatsapp: [+2349134813537]
