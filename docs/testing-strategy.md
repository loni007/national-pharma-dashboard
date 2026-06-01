# Testing Strategy

The project uses automated tests so database and dashboard-support artifacts can be
checked every time the repository changes.

## Development Tests

Development tests are written with Python's built-in `unittest` framework. They focus
on the database artifacts owned by the database design work:

- Required tables and views are present.
- Privacy-sensitive patient fields are not stored.
- Business constraints protect invalid quantities, forecasts, and import counts.
- Indexes support common dashboard queries.
- Seed data covers a realistic demo workflow.
- Documentation remains connected to the implemented schema and views.

These tests are in:

```text
tests/test_database_artifacts.py
```

## Acceptance Scenario Tests

Acceptance scenario tests represent user-facing expectations for the dashboard. They
come from typical public-health workflows instead of internal implementation details:

- A health official can monitor daily medicine demand.
- A health official can review regional alert conditions.
- A health official can inspect forecasted medicine demand.
- Patient privacy is protected while analytics remain possible.

These tests are in:

```text
tests/test_acceptance_scenarios.py
```

## Running Tests

Run all database-related automated tests from the repository root:

```bash
python -m unittest discover -s tests
```

Backend tests are maintained separately inside the backend project:

```bash
cd backend
npm test
```

## Test Maintenance

When the schema, dashboard views, example queries, or database documentation changes,
the related tests should be updated in the same commit. This keeps the test suite useful
as a safety check instead of becoming disconnected from the project.
