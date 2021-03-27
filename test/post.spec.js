const request = require("supertest");

const app = require("../app");

describe("Create social post", () => {
  test("Should  create post ", async () => {
    await request(app)
      .post("/api/posts/v1/")
      .set("x-auth-token", process.env.TEST_TOKEN)
      .send({
        text: "Test post",
      })
      .expect(201);
  });

  test("Should validate post create body", async () => {
    await request(app)
      .post("/api/posts/v1/")
      .set("x-auth-token", process.env.TEST_TOKEN)
      .send({
        // text: "Test post",
      })
      .expect(400);
  });
});

describe("Get social post", () => {
  test("Should get list of posts", async () => {
    await request(app)
      .get("/api/posts/v1/")
      .set("x-auth-token", process.env.TEST_TOKEN)
      .expect(200);
  });

  test("Should get a post by id", async () => {
    await request(app)
      .get(`/api/posts/v1/605f3452a2bb54394cd7564a`)
      .set("x-auth-token", process.env.TEST_TOKEN)
      .expect(200);
  });
});

describe("Delete post", () => {
  test("Should should delete post by user", async () => {
    await request(app)
      .delete("/api/posts/v1/605f3452a2bb54394cd7564a")
      .set("x-auth-token", process.env.TEST_TOKEN)
      .expect(200);
  });

  test("Should not delete other user post", async () => {
    await request(app)
      .delete(`/api/posts/v1/605f340d9f19082bbc0afc24`)
      .set("x-auth-token", process.env.TEST_TOKEN2)
      .expect(401);
  });
});
