from app.schemas.forecast import (
    EntityProbability,
    ForecastFactor,
    ForecastRace,
    WinLikelihoodRequest,
    WinLikelihoodResponse,
)

SAMPLE_RACES = {
    "monaco-2026": ForecastRace(
        race_id="monaco-2026",
        race_name="Monaco Grand Prix",
        circuit="Circuit de Monaco",
        round=8,
    ),
    "canada-2026": ForecastRace(
        race_id="canada-2026",
        race_name="Canadian Grand Prix",
        circuit="Circuit Gilles Villeneuve",
        round=9,
    ),
}

DEFAULT_RACE_IDS = ["monaco-2026", "canada-2026"]
GENERATED_AT = "2026-07-06T00:00:00Z"
DATA_FRESHNESS = "deterministic sample data; no live feeds, database, or trained model"


def forecast_win_likelihood(request: WinLikelihoodRequest) -> WinLikelihoodResponse:
    race_ids = request.race_ids or DEFAULT_RACE_IDS
    races = [
        SAMPLE_RACES.get(
            race_id,
            ForecastRace(
                race_id=race_id,
                race_name=race_id.replace("-", " ").title(),
                circuit="Unknown circuit",
                round=0,
            ),
        )
        for race_id in race_ids
    ]

    top_factors = [
        ForecastFactor(
            label="Street-circuit qualifying value",
            impact="positive",
            weight=0.31,
            detail="Monaco-style track position makes qualifying form unusually important.",
        ),
        ForecastFactor(
            label="Recent race pace",
            impact="positive",
            weight=0.27,
            detail="McLaren and Ferrari carry the strongest mock race-pace trend.",
        ),
        ForecastFactor(
            label="Weather uncertainty",
            impact="neutral",
            weight=0.18,
            detail="Canada adds a moderate rain and safety-car uncertainty band.",
        ),
        ForecastFactor(
            label="Sentiment signal",
            impact="positive" if request.include_sentiment else "neutral",
            weight=0.12 if request.include_sentiment else 0.0,
            detail=(
                "Mock media and team confidence signal is included."
                if request.include_sentiment
                else "Sentiment was excluded from this deterministic request."
            ),
        ),
    ]

    return WinLikelihoodResponse(
        forecast_horizon=request.forecast_horizon,
        race_ids=race_ids,
        races=races,
        driver_probabilities=[
            EntityProbability(
                entity_id="NOR",
                entity_name="Lando Norris",
                probability=0.29,
                rank=1,
                race_id=None,
                team="McLaren",
                top_factors=["recent race pace", "street-circuit qualifying value"],
            ),
            EntityProbability(
                entity_id="LEC",
                entity_name="Charles Leclerc",
                probability=0.25,
                rank=2,
                race_id=None,
                team="Ferrari",
                top_factors=["track history", "qualifying strength"],
            ),
            EntityProbability(
                entity_id="HAM",
                entity_name="Lewis Hamilton",
                probability=0.18,
                rank=3,
                race_id=None,
                team="Mercedes",
                top_factors=["race management", "weather uncertainty"],
            ),
        ],
        team_probabilities=[
            EntityProbability(
                entity_id="mclaren",
                entity_name="McLaren",
                probability=0.34,
                rank=1,
                race_id=None,
                team=None,
                top_factors=["race pace", "tyre degradation control"],
            ),
            EntityProbability(
                entity_id="ferrari",
                entity_name="Ferrari",
                probability=0.28,
                rank=2,
                race_id=None,
                team=None,
                top_factors=["qualifying strength", "street-circuit fit"],
            ),
            EntityProbability(
                entity_id="mercedes",
                entity_name="Mercedes",
                probability=0.21,
                rank=3,
                race_id=None,
                team=None,
                top_factors=["reliability", "wet-weather adaptability"],
            ),
        ],
        top_factors=top_factors,
        model_confidence=0.62,
        generated_at=GENERATED_AT,
        data_freshness=DATA_FRESHNESS,
    )
