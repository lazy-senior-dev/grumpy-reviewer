Plain SQL files applied in filename order by `bin/migrate` on Postgres 15. Each file runs in one transaction. The app runs the old code for a few minutes after a migration lands.
