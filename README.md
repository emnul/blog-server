# Development Setup

Run `pnpm run build:dev` in ui dir to get esbuild to live-reload on changes to js files

Run `docker compose -f compose.local.yaml up --watch` to start development container. A volume pointing to the ui dir is mounted in the container for live updates

# Server Side Stack
[Axum](https://docs.rs/axum/latest/axum/) - web framework

[Askama](https://djc.github.io/askama/askama.html) - templating engine

# DevOps 
[Docker](https://docs.docker.com/) - containerization

[Traefik](https://doc.traefik.io/) - Reverse Proxy, TLS Cert Renewal

[Watchtower](https://containrrr.dev/watchtower/) - Automated deployments

[Github Actions](https://docs.github.com/en/actions) - CI/CD

[UptimeRobot](https://uptimerobot.com/) - basic monitoring

[UFW](https://help.ubuntu.com/community/UFW) - network traffic management

# Frontend Stack
[HTMX](https://htmx.org/) 
