# There She Codes: Events Platform for Women in Tech

A bespoke events management platform with the aim of supporting and empowering Women in Tech 👩‍💻✨

The platform is designed to help event organisers from Women In Tech communities create and share their events with community members. Users can browse the events on offer, sign up and add events to their calendars.

### Tech Stack
<b>Frontend:</b> React (using Vite for faster builds) \
<b>Backend:</b> Express.js, PostgreSQL \
<b>Hosting:</b> Render (backend), Supabase (database), Netlify (frontend)

### Test Accounts

#### Test attendee
Email: jennysmith@attendee.com \
Password: password123

#### Test admin
Email: janedoe@admin.com \
Password: password123

## Links

Description | Link
--- | ---
Deployed version of front-end app | INSERT LINK HERE
Back-end live API | https://events-platform-ak9d.onrender.com/
Backend Documentation | https://events-platform-ak9d.onrender.com/api-docs


## Getting Started

### Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **PostgreSQL** for local development

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alicewilson17/events-platform.git
   cd events-platform
   ```

2. **Install dependencies:** Install dependencies for both the backend and frontend.

```
# For the backend
cd backend
npm install

# For the frontend
cd ../frontend/events-platform-frontend
npm install
```

3. **Configure Environment Variables:**

To run this project locally, you will need to create two environment files in the backend directory, `.env.development` and `.env.test`, to store your environment-specific configurations.

1. **.env.development** - Used for local development.
   ```
   PGDATABASE=events_platform
   JWT_SECRET=your_secret_key_here 
   ```

**2. .env.test** - Used for testing environments.
```
PGDATABASE=events_platform_test
JWT_SECRET=your_secret_key_here
```
Ensure that each environment file includes the PGDATABASE for the appropriate database and a JWT_SECRET (which should be set to a unique, random string) for token signing and verification.

Note: Remember to add these files to your .gitignore to keep your environment configurations private and secure. 

You will also need to create a .env file in the frontend/events-platform-frontend directory, containing the following:

```
VITE_API_URL=http://localhost:9090/api
```

4. Set Up the Database: Ensure PostgreSQL is running locally, and set up the required database and tables, by running the following command:

```
npm run setub-dbs
```

Seed the development database by running the following command:

```
npm run seed
```

## Running Tests
This project was created according to Test Driven Development practices. The test suite can be found in the __tests__/auth.test.js directory.

To run the test suite for the api, run the following command:
```
npm test
```
The test suite uses the data from the test database. The test suite is set up such that the test database will be re-seeded before each test is run, to ensure that the outcome of a given test is not affected by any of the previous tests.

## Running the Application
**Start the Backend Server:** Open a terminal in the backend folder and start the server.
```
cd backend
npm start
```
The server should now be running on http://localhost:9090.

**Start the Frontend Development Server:** Open a terminal in the frontend/events-platform-frontend folder and start the React development server.
```
cd ../frontend
npm run dev
```
The frontend should now be running on http://localhost:5173.

## Future Improvements
- Admin-only endpoint: update event
- Admin-only enpoint: delete event
- Stripe for secure payment
- Allow sorting and filtering of events