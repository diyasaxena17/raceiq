# RaceIQ Data Dictionary

Dataset fields will be documented as the training, replay, and forecasting datasets are finalized.

## Forecasting Feature Groups

Planned win-likelihood features:

- Race: race id, round number, date, circuit id, sprint weekend flag.
- Track: length, corner profile, overtaking difficulty, tyre stress, historical safety car rate.
- Weather: air temperature, track temperature, rain probability, wind, humidity, forecast volatility.
- Driver: driver id, recent form, qualifying pace, race pace, track history, wet-weather performance, incident rate.
- Team: team id, constructor form, strategy execution, pit stop performance, reliability, upgrade trend.
- Car: straight-line speed proxy, cornering proxy, tyre degradation proxy, qualifying/race pace delta.
- Sentiment: source, timestamp, entity, normalized sentiment score, confidence, topic.
- Outcome labels: driver win, team win, podium, points finish, DNF.

## Storage Direction

Small CSV or JSON fixtures are enough for the first demo. PostgreSQL should be used when these feature groups need joins across races, drivers, teams, weather samples, sentiment snapshots, and model runs.
