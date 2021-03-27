const request = require("supertest");

const app = require("../app");

describe("Create post", () => {
  var token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjA1Y2QyNGY0MGUxZWQyYmYwNzczYzE2In0sImlhdCI6MTYxNjY5NTg5NCwiZXhwIjoxNjE3MTI3ODk0fQ.bLx__o3pD_HSd9sXys1-JraLVjeyuUxbZoIYk2xanV8";
  //   before((done) => {
  //     request(app)
  //       .post("/api/auth/v1/login")
  //       .end((err, res) => {
  //         token = res.token;
  //         done();
  //       });
  //   });

  test("Should validate post create body", async () => {
    await request(app)
      .post("/api/posts/v1/")
      .set("x-auth-token", token)
      .send({
        // text: "Test post",
      })
      .expect(400);
  });

  test("Should get list of posts", async () => {
    await request(app)
      .get("/api/posts/v1/")
      .set("x-auth-token", token)
      .expect(200);
  });
});
