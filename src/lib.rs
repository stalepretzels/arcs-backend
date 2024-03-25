use axum::{handler::get, Router};
use axum::routing::box_handler;
use axum::ws::{ws, WebSocket};
use std::sync::Arc;
use tokio::sync::Mutex;

async fn websocket_handler(websocket: WebSocket, state: Arc<Mutex<Vec<String>>>) {
    let (mut sender, mut receiver) = websocket.split();

    while let Some(Ok(message)) = receiver.next().await {
        let message = message.to_str().unwrap();
        println!("Received message: {}", message);
        state.lock().await.push(message.to_string());
    }
}

async fn log_messages(state: Arc<Mutex<Vec<String>>>) -> String {
    let log = state.lock().await.iter().fold(String::new(), |acc, message| {
        acc + message + "\n"
    });
    log
}

#[tokio::main]
async fn main() {
    let state = Arc::new(Mutex::new(Vec::new()));

    let app = Router::new()
        .route("/ws", ws(websocket_handler))
        .boxed();

    let logging_app = Router::new()
        .route("/logs", get(log_messages))
        .boxed();

    let app = app.or(logging_app);

    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}