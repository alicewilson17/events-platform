const request = require("supertest");
const app = require("../index");
const seed = require("../db/seeds/seeds");
const data = require("../db/data/test-data");
const db = require("../db/db");

beforeEach(() => {
    return seed(data);
  });
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
console.log(response)

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
               id: expect.any(Number),
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