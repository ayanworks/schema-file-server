FROM denoland/deno:latest

# Set the working directory inside the container
WORKDIR /app

USER deno

#COPY server.ts .6
COPY . .

# Ensure proper permissions during container runtime
CMD ["sh", "-c", "deno run --allow-net --allow-env --allow-read --allow-write server.ts"]
