const request = require("supertest");
const app = require("../index");
const seed = require("../db/seeds/seeds");
const data = require("../db/data/test-data");
const db = require("../db/db");

let userToken
let adminToken

beforeEach(async () => {
    await seed(data)
    //log in a non-admin user to get the token
    const userLoginResponse = await request(app)
    .post('/api/auth/login')
    .send({email: 'rachel.brown@example.com', password: 'password123'})

    userToken = userLoginResponse.body.token

    // log in an admin user to get the token
    const adminLoginResponse = await request(app)
    .post('/api/auth/login')
    .send({email: 'sophie.johnson@example.com', password: 'password123'})

    adminToken = adminLoginResponse.body.token
})

  afterAll(() => {
    db.end();
  });

//signup
describe('POST /api/auth/signup', () => {
    test('should create a new user and return user data', async () => {
        const newUser = {first_name: 'Bob', last_name: 'Bobson', email: "bob@bob.com", password: 'password123', role: 'user'}
        const response = await request(app)
        .post('/api/auth/signup')
        .send(newUser)
           
        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty('email', 'bob@bob.com');
        expect(response.body.user).toHaveProperty('first_name', 'Bob');
    });
});

//login
describe('POST /api/auth/login', () => {
    test('should return user data', async () => {
        const newUser = { first_name: 'Bob', last_name: 'Bobson', email: "bob@bob.com", password: 'password123', role: 'user' };
        await request(app)
            .post('/api/auth/signup')
            .send(newUser);
        const userDetails = {email: 'bob@bob.com', password: 'password123'}
        const response = await request(app)
        .post('/api/auth/login')
        .send(userDetails)


        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty('email', 'bob@bob.com')
        expect(response.body).toHaveProperty('token')
    });
});

//events
describe('GET /api/events/', () => {
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
                location: expect.any(String),
                price: expect.any(String),
                is_paid: expect.any(Boolean),
                created_by: expect.any(Number),
                img: expect.any(String),
              });
            });
          });
        })
    })

    describe('GET /api/events/:id', () => {
        test('should respond with correct event', () => {
            return request(app)
            .get('/api/events/2')
            .expect(200)
            .then((res) => {
                const event = res.body.event
                expect(event.title).toBe('Women in Tech Meetup - London')
            })
        });
        test('should respond with 404 if event doesnt exist', () => {
            return request(app)
            .get('/api/events/20000')
            .expect(404)
            .then((res) => {
                const error = res.body
                expect(error.msg).toBe("Event not found")
            })
        });
    });

    describe('POST /api/events', () => {
        test('should create a new event if the user is an admin', async () => {
            const testEvent = {
                title: 'TDD for women',
                description: 'A webinar about TDD for women.',
                date: '2024-11-05 10:00:00',
                location: 'Online Webinar',
                price: 0.00,
                is_paid: false,
                img: 'https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg'
            }

          const response = await request(app)
            .post("/api/events")
            .set('Authorization', `Bearer ${adminToken}`)
            .send(testEvent)
            
            expect(response.status).toBe(201)
          expect(response.body.event).toMatchObject({
                title: 'TDD for women',
                description: 'A webinar about TDD for women.',
                date: '2024-11-05T10:00:00.000Z',
                location: 'Online Webinar',
                price: "0.00",
                is_paid: false,
                created_by: 1,
                img: 'https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg'})
              })
        test('should throw 403 error if user is not an admin', async () => {
                const testEvent = {
                    title: 'TDD for women',
                    description: 'A webinar about TDD for women.',
                    date: '2024-11-05 10:00:00',
                    location: 'Online Webinar',
                    price: 0.00,
                    is_paid: false,
                    img: 'https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg'
                }
    
              const response = await request(app)
                .post("/api/events")
                .set('Authorization', `Bearer ${userToken}`)
                .send(testEvent)
                
                expect(response.status).toBe(403)
              expect(response.body.msg).toBe("Access denied. Admins only.")
                  })
            });
            
//sign up to event
describe('POST /api/events/:event_id/signup', () => {
    test('should return new signup and 201 if user successfully signs up to an event', async () => {
        const response = await request(app)
        .post("/api/events/1/signup")
        .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).toBe(201)
        expect(response.body.msg).toBe(`Successfully signed up user 2 to event 1`)
    });
    test('should return 400 if user is already signed up to this event', async () => {
       const firstSignUp = await request(app)
        .post("/api/events/1/signup")
        .set('Authorization', `Bearer ${userToken}`)
        expect(firstSignUp.status).toBe(201)

        const secondSignUp = await request(app)
        .post("/api/events/1/signup")
        .set('Authorization', `Bearer ${userToken}`)

        expect(secondSignUp.status).toBe(400)
        expect(secondSignUp.body.msg).toBe(`You are already signed up for this event.`)
    });
    test('should return 404 if event id is invalid', async () => {
         const response = await request(app)
         .post("/api/events/39/signup")
         .set('Authorization', `Bearer ${userToken}`)
 
         expect(response.status).toBe(404)
         expect(response.body.msg).toBe(`Event not found`)
     });
     test('should return error if user not authenticated', async () => {
        const response = await request(app).post("/api/events/1/signup") //no auth header
        expect(response.status).toBe(401) //unauthorised
        expect(response.body.msg).toBe('No token provided. Authorisation denied.')
     });
});


//handle case where the user is not authenticated.