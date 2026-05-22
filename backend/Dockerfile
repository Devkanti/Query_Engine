FROM rust:1.85-slim as builder
WORKDIR /usr/src/app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin/backend
EXPOSE 8080
CMD ["backend"]
