# Live Your Life

A classroom game about personal finance. Players join a supervised session, make life choices over several phases, and see how those choices affect their situation.

When the app is running, it opens on the **home** page. To start it locally, see [docs/](docs/).

## Players

1. Open `/home`.
2. Enter the **room code** from the supervisor.
3. Enter your **name** and **table number**.
4. Join. You wait in the waiting room until the supervisor starts the game.
5. You can still change table in the waiting room. After the game has started, you cannot.

## Supervisor

1. Change `/home` in the URL to `/supervisor`.
2. Enter PIN **0420**.
3. Create a room. Share the room code with the players.
4. Watch the tables fill up on the dashboard.
5. When everyone is at the right table, **start the game**. The dashboard shows which phase each table is in.

## Getting your team repository

Create your repository from this template in the `Innovatieproject` GitHub organization. Name it `INN-x`, replacing `x` with your team number (for example `INN-1`).

## Sigrid

This project is connected to [Sigrid](https://sigrid-says.com) for code quality feedback.

Sigrid uses your **GitHub repository name** as the system name, under customer `hogent`. If your repository is `INN-1`, your Sigrid system will be `INN-1`.

1. Create a Sigrid authentication token.
2. In your GitHub repository, open **Settings → Secrets and variables → Actions**.
3. Add a repository secret named `SIGRID_CI_TOKEN` with that token as the value.

After the token is in place, the first push to `main` onboards your system automatically. Pull requests receive Sigrid feedback as a comment.

Setup details are in the [Sigrid GitHub Actions documentation](https://docs.sigrid-says.com/sigridci-integration/github-actions.html).
