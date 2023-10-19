use envconfig::Envconfig;
use hmac::{digest::KeyInit, Hmac};
use poem::{listener::TcpListener, middleware::Cors, EndpointExt, Route, Server};
use poem_openapi::OpenApiService;
use sea_orm::Database;
use sha2::Sha256;
use std::error::Error;
mod config;
mod endpoints;
// use migration::{Migrator, MigratorTrait};
mod entity;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenv::dotenv().ok();
    let config = config::Config::init_from_env().expect("Failed to read config from env");
    let connection = Database::connect(&config.database_url).await?;
    // Migrator::up(&connection, None).await?;

    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "poem=debug");
    }
    tracing_subscriber::fmt::init();

    let api_services = (endpoints::auth::AuthApi);

    let api_service = OpenApiService::new(api_services, "ai-assistant", "1.0")
        .server("http://localhost:5000/api");
    let explorer = api_service.openapi_explorer();
    let spec_endpoint = api_service.spec_endpoint();
    let server_key = Hmac::<Sha256>::new_from_slice(config.secret_key.as_bytes())
        .expect("need valid server key");

    let app = Route::new()
        .nest("/api", api_service)
        .nest("/", explorer)
        .nest("/spec", spec_endpoint)
        .data(server_key)
        .with(Cors::new())
        .data(connection);

    Server::new(TcpListener::bind("127.0.0.1:5000"))
        .run(app)
        .await?;
    Ok(())
}
