// test.js
const { spec } = require("pactum");
const chai = require("chai");
const expect = chai.expect;

describe("Bassliner", () => {
  let _spec = spec();

  it("should return valid response from HH ZOB", async () => {
    await _spec
      .post("https://bassliner.org/api/event/tours")
      .withJson({
        event_id: 110,
        tour_type_id: 1,
        meeting_point_id: 3,
      })
      .expectStatus(200)
      .retry({
        count: 3,
        delay: 5000,
        strategy: ({ res }) => {
          return res.statusCode === 200;
        },
      })
      .expectJsonLike("$V.length >= 30")
      .expectJsonLike([
        {
          event_id: 110,
        },
      ]);
  });
  it("hasn't got two free seats on 28.06 from HH ZOB", async () => {
    await _spec.expect((ctx) =>
      expect(
        ctx.res.body
          .filter((ele) => !!ele.departures && ele.departures.length >= 1)
          .filter((ele) => /2023-06-28 \d{2}:\d{2}:\d{2}/.test(ele.time))
          .filter((ele) =>
            ele.departures.some(
              (dep) =>
                dep.price_groups?.some((block) => block.count >= 2) ?? false
            )
          ).length
      ).to.eql(0)
    );
  });
  it("should return valid response for HH Veddel", async () => {
    let _spec = spec();
    await _spec
      .post("https://bassliner.org/api/event/tours")
      .withJson({
        event_id: 110,
        tour_type_id: 1,
        meeting_point_id: 4,
      })
      .expectStatus(200)
      .retry({
        count: 3,
        delay: 5000,
        strategy: ({ res }) => {
          return res.statusCode === 200;
        },
      })
      .expectJsonLike("$V.length >= 20")
      .expectJsonLike([
        {
          event_id: 110,
        },
      ]);
  });
  it("hasn't got two free seats on 28.06 from HH Veddel", async () => {
    await _spec.expect((ctx) =>
      expect(
        ctx.res.body
          .filter((ele) => !!ele.departures && ele.departures.length >= 1)
          .filter((ele) => /2023-06-28 \d{2}:\d{2}:\d{2}/.test(ele.time))
          .filter((ele) =>
            ele.departures.some(
              (dep) =>
                dep.price_groups?.some((block) => block.count >= 2) ?? false
            )
          ).length
      ).to.eql(0)
    );
  });
});
