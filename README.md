# stack_movies
A comprehensive full-stack movie management system built with React.js for the frontend, Node.js and Express.js for the backend, and MongoDB as the database. This application allows users to browse and view detailed information about movies categorized by theaters, and make reservations. It features a robust user authentication system with role-based access control, enabling regular users to book tickets while providing admin functionalities such as adding, updating, and deleting movies. The system offers dynamic content display, ensuring that movie listings, showtimes, and reservations are updated in real time based on the data in the database. The interface is designed to be responsive, offering seamless usability across different devices. Additionally, JWT-based authentication ensures secure user sessions, while the admin dashboard gives administrators full control over managing movie records and user reservations. This platform is ideal for cinemas or theater chains looking for a modern, scalable solution for managing their movie schedules and customer bookings.
# Movies Web
https://stack-movies.vercel.app/

# Figma design
https://www.figma.com/design/iQTHGXtbTt9hlOS96ppC4F/movie?node-id=0-1&node-type=CANVAS&t=Z0hkatbXGouFZOEM-0

## Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/Uvesh99/stack_movies
   ```

2. Initialize Of Backend:

   ```sh
   cd backend
   npm i
   ```
   
   ## make .env file in backend and in that include following things:
   
   ```sh
   SECRET_KEY= secret
   DB_URL= your mongoDB URL
   EMAIL= your email
   PASSWORD = google genarated password
   ```

4. Initialize Of Frontend
   ```sh
   cd frontend 
   npm i
   ```

## Running the Website Locally

1. Start the server:

   ```sh
   cd backend
   node app.js
   ```
   
2. Start the frontend:
   
   ```sh
   cd frontend
   npm run dev
   ```
   
2. Open your browser and navigate to `http://localhost:5173/` to view the website.

3. Note that both backend and frontend must be run at the same time.

### How to create Password

1. Open Gmail.
2. Go to "manage you account".
3. Go to Security.
4. Make sure that 2-step verification is in on mode.
5. Search "App Password".
6. Enter App name and get the password and put it in env file.

### Make sure that you implement using MUI.. dont use css or tailwind.. if its needed then inform us and then contribute.
