const request = require("supertest");
const app = require("../index");
const seed = require("../db/seeds/seeds");
const data = require("../db/data/test-data");
const db = require("../db/db");

let userToken;
let adminToken;

beforeEach(async () => {
  await seed(data);
  //log in a non-admin user to get the token
  const userLoginResponse = await request(app)
    .post("/api/auth/login")
    .send({ email: "rachel.brown@example.com", password: "password123" });

  userToken = userLoginResponse.body.token;

  // log in an admin user to get the token
  const adminLoginResponse = await request(app)
    .post("/api/auth/login")
    .send({ email: "sophie.johnson@example.com", password: "password123" });

  adminToken = adminLoginResponse.body.token;

});

afterAll(() => {
  db.end();
});

//signup
describe("POST /api/auth/signup", () => {
  test("should create a new user and return user data", async () => {
    const newUser = {
      first_name: "Bob",
      last_name: "Bobson",
      email: "bob@bob.com",
      password: "password123",
      role: "user",
    };
    const response = await request(app).post("/api/auth/signup").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty("email", "bob@bob.com");
    expect(response.body.user).toHaveProperty("first_name", "Bob");
  });
});

//login
describe("POST /api/auth/login", () => {
  test("should return user data", async () => {
    const newUser = {
      first_name: "Bob",
      last_name: "Bobson",
      email: "bob@bob.com",
      password: "password123",
      role: "user",
    };
    await request(app).post("/api/auth/signup").send(newUser);
    const userDetails = { email: "bob@bob.com", password: "password123" };
    const response = await request(app)
      .post("/api/auth/login")
      .send(userDetails);

    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty("email", "bob@bob.com");
    expect(response.body.user).toHaveProperty("first_name", "Bob");
    expect(response.body).toHaveProperty("token");
  });
});

//events
describe("GET /api/events/", () => {
  test("GET all events with correct properties", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then((res) => {
        const events = res.body.events;
        expect(events.length).toBe(3);
        events.forEach((event) => {
          expect(event).toMatchObject({
            event_id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            date: expect.any(String),
            start_time: expect.any(String),
            end_time: expect.any(String),
            location: expect.any(String),
            price: expect.any(String),
            is_paid: expect.any(Boolean),
            created_by: expect.any(Number),
            img: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/events/:id", () => {
  test("should respond with correct event", () => {
    return request(app)
      .get("/api/events/2")
      .expect(200)
      .then((res) => {
        const event = res.body.event;
        expect(event.title).toBe("Women in Tech Meetup - London");
        expect(event.start_time).toBe("14:00:00")
      });
  });
  test("should respond with 404 if event doesnt exist", () => {
    return request(app)
      .get("/api/events/20000")
      .expect(404)
      .then((res) => {
        const error = res.body;
        expect(error.msg).toBe("Event not found");
      });
  });
});

describe("POST /api/events", () => {
  test("should create a new event if the user is an admin", async () => {
    const testEvent = {
      title: "TDD for women",
      description: "A webinar about TDD for women.",
      date: "2024-11-05",
      start_time: "10:00:00",
      end_time: "12:00:00",
      location: "Online Webinar",
      price: 0.0,
      is_paid: false,
      img: "https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg",
    };

    const response = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(testEvent);

    expect(response.status).toBe(201);
    expect(response.body.event).toHaveProperty("start_time")
    expect(response.body.event).toMatchObject({
      title: "TDD for women",
      description: "A webinar about TDD for women.",
      date: "2024-11-05T00:00:00.000Z",
      start_time: "10:00:00",
      end_time: "12:00:00",
      location: "Online Webinar",
      price: "0.00",
      is_paid: false,
      created_by: 1,
      img: "https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg",
    });
  });
  test("should throw 403 error if user is not an admin", async () => {
    const testEvent = {
      title: "TDD for women",
      description: "A webinar about TDD for women.",
      date: "2024-11-05",
      start_time: "10:00:00",
      end_time: "12:00:00",
      location: "Online Webinar",
      price: 0.0,
      is_paid: false,
      img: "https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg",
    };

    const response = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${userToken}`)
      .send(testEvent);

    expect(response.status).toBe(403);
    expect(response.body.msg).toBe("Access denied. Admins only.");
  });
});

//sign up to event 
describe("POST /api/events/:event_id/signup", () => {
  test("should return new signup and 201 if user successfully signs up to an event", async () => {
    const response = await request(app)
      .post("/api/events/1/signup")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(201);
    expect(response.body.msg).toBe(`Successfully signed up user 2 to event 1`);
  });
  test("should return 400 if user is already signed up to this event", async () => {
    const firstSignUp = await request(app)
      .post("/api/events/1/signup")
      .set("Authorization", `Bearer ${userToken}`);
    expect(firstSignUp.status).toBe(201);

    const secondSignUp = await request(app)
      .post("/api/events/1/signup")
      .set("Authorization", `Bearer ${userToken}`);

    expect(secondSignUp.status).toBe(400);
    expect(secondSignUp.body.msg).toBe(
      `You are already signed up for this event.`
    );
  });
  test("should return 404 if event id is invalid", async () => {
    const response = await request(app)
      .post("/api/events/39/signup")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(`Event not found`);
  });
  test("should return error if user not authenticated", async () => {
    const response = await request(app).post("/api/events/1/signup"); //no auth header
    expect(response.status).toBe(401); //unauthorised
    expect(response.body.msg).toBe("No token provided. Authorisation denied.");
  });
});

//get all events signed up to by user
describe("GET /api/users/:user_id/signups", () => {
  test("should return 200 status and get all signups for user", async () => {
    await request(app)
      .post("/api/events/1/signup")
      .set("Authorization", `Bearer ${userToken}`);

    await request(app)
      .post("/api/events/2/signup")
      .set("Authorization", `Bearer ${userToken}`);

    const response = await request(app)
      .get("/api/users/2/signups")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    const signUps = response.body.signUps;
    expect(signUps.length).toBe(2);
    signUps.forEach((signUp) => {
      expect(signUp).toMatchObject({
        event_id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        date: expect.any(String),
        start_time: expect.any(String),
        end_time: expect.any(String),
        location: expect.any(String),
        img: expect.any(String),
      });
    });
  });
  test("should respond with 403 if user not found", async () => {

    await request(app)
    .post("/api/events/1/signup")
    .set("Authorization", `Bearer ${userToken}`);
  await request(app)
    .post("/api/events/2/signup")
    .set("Authorization", `Bearer ${userToken}`);

    const response = await request(app)
      .get("/api/users/1000/signups") // Using a non-existent user ID
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body.msg).toBe("Access denied.");
  });

  test("should respond with 401 if the user is not authenticated", async () => {
    const response = await request(app)
      .get(`/api/users/1/signups`); // No token provided
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe('No token provided. Authorisation denied.');

})
})



//admin only: get created events with signups
describe("GET /api/admin/events", () => {
it("should return all events created by the admin with signup counts", async () => {
    const response = await request(app)
      .get("/api/users/admin/events")
      .set("Authorization", `Bearer ${adminToken}`); 

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("adminEvents");
    expect(Array.isArray(response.body.adminEvents)).toBe(true);
    expect(response.body.adminEvents.length).toBeGreaterThan(0); 

    // Validate the structure of the events
    response.body.adminEvents.forEach((event) => {
      expect(event).toHaveProperty("event_id");
      expect(event).toHaveProperty("title");
      expect(event).toHaveProperty("description");
      expect(event).toHaveProperty("date");
      expect(event).toHaveProperty("start_time");
      expect(event).toHaveProperty("end_time");
      expect(event).toHaveProperty("location");
      expect(event).toHaveProperty("price");
      expect(event).toHaveProperty("is_paid");
      expect(event).toHaveProperty("created_by");
      expect(event).toHaveProperty("img");
      expect(event).toHaveProperty("signup_count");
    });
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/api/users/admin/events");
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ msg: "No token provided. Authorisation denied." });
  });

  it("should return 403 if user is not an admin", async () => {
    const response = await request(app)
      .get("/api/users/admin/events")
      .set("Authorization", `Bearer ${userToken}`); 

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ msg: "Access denied. Admins only." });
  });
})


//admin only: update event 
describe('PUT /api/events/:event_id', () => {
  test('should update the event and return updated data', async () => {

    const updatedData = {
      title: 'Updated Event Title',
      description: 'A beginner-friendly coding workshop to introduce women to HTML, CSS, and JavaScript.',
      date: '2024-11-10',
      start_time: '14:00:00',
      end_time: '16:00:00',
      location: 'Online Webinar',
      price: 0.00,
      is_paid: false,
      created_by: 1,
      img: 'https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg'
    }

    const response = await request(app)
      .put(`/api/events/1`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedData)
      .expect(200);

      expect(response.body.updatedEvent).toMatchObject({
        title: 'Updated Event Title',
        description: 'A beginner-friendly coding workshop to introduce women to HTML, CSS, and JavaScript.',
        date: '2024-11-10T00:00:00.000Z',
        start_time: '14:00:00',
        end_time: '16:00:00',
        location: 'Online Webinar',
        price: '0.00',
        is_paid: false,
        created_by: 1,
        img: 'https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg'
      });
  });

  test('should return a 404 if the event is not found', async () => {
    const updatedData = {
      title: 'Updated Event Title',
      description: 'A beginner-friendly coding workshop to introduce women to HTML, CSS, and JavaScript.',
      date: '2024-11-10',
      start_time: '14:00:00',
      end_time: '16:00:00',
      location: 'Online Webinar',
      price: 0.00,
      is_paid: false,
      created_by: 1,
      img: 'https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg'
    }

    const response = await request(app)
      .put(`/api/events/999`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedData)
      .expect(404);

      expect(response.body).toEqual({msg: "Event not found"})
  });

  test('should return a 400 for invalid input data', async () => {
    const invalidData = {
      title: '', 
      date: 'invalid-date',
      location: 'Updated Location'
    };

    const response = await request(app)
      .put(`/api/events/1`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(invalidData)
      .expect(400);

    expect(response.body).toEqual({msg: "All fields are required."})
  });

  test('should return a 401 if the user is unauthorized', async () => {
    const updatedData = {
      title: 'Updated Event Title',
      description: 'A beginner-friendly coding workshop to introduce women to HTML, CSS, and JavaScript.',
      date: '2024-11-10',
      start_time: '14:00:00',
      end_time: '16:00:00',
      location: 'Online Webinar',
      price: 0.00,
      is_paid: false,
      created_by: 1,
      img: 'https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg'
    }

    const response = await request(app)
      .put(`/api/events/1`)
      .send(updatedData)
      .expect(401);

    expect(response.body).toEqual({msg: "No token provided. Authorisation denied."})
  });

  test('should return a 401 if the user is unauthorized', async () => {
    const updatedData = {
      title: 'Updated Event Title',
      description: 'A beginner-friendly coding workshop to introduce women to HTML, CSS, and JavaScript.',
      date: '2024-11-10',
      start_time: '14:00:00',
      end_time: '16:00:00',
      location: 'Online Webinar',
      price: 0.00,
      is_paid: false,
      created_by: 1,
      img: 'https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg'
    }

    const response = await request(app)
      .put(`/api/events/1`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(updatedData)
      .expect(403);

    expect(response.body).toEqual({msg: "Access denied. Admins only."})
  });
});

describe('DELETE /api/events/:event_id', () => {
  it('should allow the admin to delete an event they created', async () => {
      const response = await request(app)
          .delete('/api/events/1')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

      expect(response.body.msg).toBe('Event deleted successfully');
      expect(response.body.deletedEvent).toHaveProperty('event_id', 1);
  });

  it('should prevent a regular user from deleting an event', async () => {
      const response = await request(app)
          .delete('/api/events/1')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);

      expect(response.body.msg).toBe('Access denied. Admins only.');
  });

  it('should return 404 if the event does not exist', async () => {
      const response = await request(app)
          .delete('/api/events/999')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);

      expect(response.body.msg).toBe('Event not found');
  });

  it('should prevent the admin from deleting an event they did not create', async () => {
      // Insert a test event created by a different admin
      await db.query(`
          INSERT INTO events (title, description, date, start_time, end_time, location, price, is_paid, created_by, img)
          VALUES ('Another Event', 'Another Description', '2024-11-15', '10:00:00', '12:00:00', 'Online', 0.00, false, 2, 'https://example.com/image2.jpg');
      `);

      const response = await request(app)
          .delete('/api/events/4')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(403);

      expect(response.body.msg).toBe('You are not authorized to delete this event.');
  });
});