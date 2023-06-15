// test.js
const { spec } = require("pactum");
const { eachLike, regex } = require("pactum-matchers");
const chai = require("chai");
const expect = chai.expect;

describe("Bassliner", () => {
  const _spec = spec();

  it("should return valid response", async () => {
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
      .expect((ctx) => {
        expect(
          ctx.res.json.every((ele) => {
            return ele.event_id === 110; // &&
          })
        ).to.be.true;
      });
  });
  it("has two free seats before 29.06", async () => {
    await _spec.expect((ctx) =>
      expect(
        ctx.res.body
          .filter((ele) => !!ele.departures && ele.departures.length >= 1)
          .filter((ele) => /2023-06-2(8|9) \d{2}:\d{2}:\d{2}/.test(ele.time))
          .filter((ele) =>
            ele.departures.some(
              (dep) =>
                dep.price_groups?.some((block) => block.count >= 2) ?? false
            )
          ).length
      ).to.above(0)
    );
  });
  it("has two free seats on 28.06", async () => {
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
      ).to.above(0)
    );
  });
});
