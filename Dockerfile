FROM denoland/deno:alpine-1.20.4
WORKDIR /app
EXPOSE 80
ENV DENO_ENV=production

COPY mods mods
COPY import_map.json .
COPY deno_prod.json deno.json
RUN mkdir uploads && deno cache mods/server/mod.ts

CMD [ "task", "start" ]