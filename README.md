# FFCSThingy2.0

FFCSThingy2.0 is a course scheduling helper built for FFCS in VIT, Vellore. 

The framework is extensible and modular, allowing use with other timetable structures as well.

## Built With
- [React.js](https://reactjs.org/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Redux](https://redux.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

## Setting Up:
- Install Node, Mongo
- Run ```mongod``` in a terminal somewhere (Not required if it's running as a service)
- Google OAuth
  - [Enable APIs](https://developers.google.com/identity/protocols/oauth2/web-server#enable-apis)
  - [Create credentials](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred)
    - Under redirect URIs, you want to add `http://localhost:3001/auth/google/redirect`
- Backend
  - run ```npm i```
  - create a `.env` file
  - Add the ID and Secret you got from OAuth in the `.env` file
  - ```
    NODE_GOOGLE_CLIENT_ID=<Your Client ID>
    NODE_GOOGLE_CLIENT_SECRET=<Your Client Secret>
    ```
  - run ```node server.js```
- Client
  - run ```npm i```
  - run ```npm start```
  - Login using a Google Account (top-right corner)
- Database
  - Add an admin scope to your user to be able to populate the details in the DB
  - Open a mongo shell with ```mongo```
  - Choose the appropriate DB with ```use FFCS```
  - Run ```db.users.update({}, { $set: { scopes: ['user', 'admin'] } })```
    - This will add the admin scope to all existing users, so be careful
- Navigate to: 
	-  ```http://localhost:3001/course/addCoursesToDB```    
    -  ```http://localhost:3001/curriculum/updateCurriculums```
    -  These will populate the database with pre-existing data
 -  You should be good to go!

## Features
### Frontend
- Built with Redux and React
- Uses custom components built on top of React Bootstrap
- Uses TypeScript
- Extensible
  - [Timetable](/client/src/constants/Timetable.js) defines the layout of the timetable and values of cells
  - [Clashmap](/client/src/constants/ClashMap.ts) defines the data structure used to check for clashes
    - This can be changed to define which slots clash with each other
    - It forms the base of a lot of interactions of the app
  - [Courses](/client/src/constants/Courses.js) defines the type of courses and slots available and utility functions to check types and convert them to standard types
    - The ```validSlots``` constant is used to search for courses by slot
  - Theming
    - [Themes](/client/src/constants/Themes.ts) defines the themes in the app
    - [Theme CSS](/client/src/css/constants/_colorPalette.scss) defines the actual theme components
    - Uses SCSS and CSS Modules for a clean structure
    - Theming is based on CSS variables using a [mixin](/client/src/css/utilities/_mixins.scss)

### Backend
- Built with Node and MongoDB
- Uses Mongoose for stricter MongoDB usage
- Uses Express for routing
