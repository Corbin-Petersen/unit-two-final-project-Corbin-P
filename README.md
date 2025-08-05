# LaunchCode Unit 2 Final Project: WistLish

### What is _WistLish_?

**WistLish** is a full-stack web application that is your way to easily build wish lists from items you find *all over* the interwebs! Simply create a list for anything you want - like favorite spatulas or supplies for puppy shower - and either track your list yourself, or share your list with others that might want to know what items you or your new puppy wishes for! The worldwide web is your oyster, with **_WistLish_**.

## TECHNOLOGIES USED
- **React**  [ _JavaScript, HTML, CSS_ ]
- **Spring Boot**  [ _Java_ ]
- **MySQL**

## RUNNING WISTLISH LOCALLY
### Tools needed:
- **Visual Studio Code** (aka VS Code) - _Will build and run React frontend_
- **IntelliJ IDEA** - _Will build and run Spring Boot backend_
- **MySQL Workbench** - _Local database creation and management_
> [!IMPORTANT]  
> The following instructions will use these tools exclusively, but will not go into exhaustive detail on how to use the programs. Refer to the program's help documentation if you have questions.

### Installation Steps
1. **Clone the WistLish repo to your machine**  
Once you have successfully cloned the repo, move on to step 2 _before opening any containing folders with IntelliJ or VS Code_.
2. **Build the SQL Schema**  
Using MySQL Workbench,  
   1. create a new MySQL Connection (if none exist) using port 3306  
   2. open that connection and create a new schema named `wistlish_db`  
   3. inside the new schema, create the following 4 tables:
      - `user`
      - `wishlist`
      - `item`
      - `user_image`  
   4. Make note of the schema's root username and password.
3. **Using IntelliJ IDEA, open the `wistlish-backend` folder inside the repo.**  
Once the folder has imported into IntelliJ, open the `application.properties` file and note the Environment Variables used to connect to the database. Make sure to create those inside IntelliJ:
   - `DB_HOST`: localhost  
   - `DB_NAME`: wistlish_db  
   - `DB_PORT`: 3306  
   - `DB_USER`: (your root admin username)  
   - `DB_PASS`: (your root admin password)  
   - `JWT_SECRET`: this is necessary to create the login token/cookies. make this be a long run-on sentence with no spaces. _EXAMPLE_:  
   `thisisthebestpasswordanyonehasevercomeupwithinthewholeworld`
4. **Build (or Rebuild) the project in IntelliJ.**  
If you have properly created the Environment Variables to connect to the database, Spring Boot will automatically populate the database tables with the necessary columns to hold the data needed for WistLish.
5. **Using Visual Studio Code, open the `wishlist-frontend` folder.**  
Provided you don't run into any initial build errors in your copy of VS Code (due to missing Node or Vite), you should now be ready to run the application!
6. **Run the backend Spring Boot application with IntelliJ.**  
This will get the RESTful API backend running at port 8080
7. **Inside VS Code, start the live frontend application**  
To do so, open a new Terminal window and make sure you are in the `wishlist-frontend` folder, and type the following:  `npm run dev`. This will start up the frontend React application on port 5173.
8. **In a browser, navigate to `http://localhost:5173` and begin using WistLish!**  

> [!WARNING] | Known Issue  
> Due to the nature of React as a frontend, any refresh of the page after logging in will remove the ability to navigate back to the user's lists. Authentication will still allow editing the current page, but in order to navigate around the application as intended, the user must re-login to the application. 

## FUTURE FEATURES & FIXES
While WistLish is a fully-functioning application, there are a number of features in development to be added at a future date:  
- Add an email verification step to the user registration process.
- Create a "forgot password" feature, allowing users to reset their password using _One Time Tokens_.
- Add the ability for users to upload a profile picture to their account.
- (see Known Issue above) Add persistence for user information based on login cookie, should accidental browser refreshes happen. 

## PROJECT LINKS
- [Wireframe](https://miro.com/app/board/uXjVIzItsss=/) (on Miro)  
_The initial wireframes used to visualize the various views_
- [Project Kanban Board](https://trello.com/b/3RVzi9eh) (on Trello)  
_The kanban board to track user stories and application development._
- [ER Diagram](https://miro.com/app/board/uXjVJeSOfg0=/?share_link_id=967876599538) (on Miro)  
_A diagram mapping out the relational database structure._