use hmac::Hmac;
use jwt::{SignWithKey, VerifyWithKey};
use poem::{error::InternalServerError, web::Data, Request, Result};
use poem_openapi::{
    auth::ApiKey,
    payload::{Json, PlainText},
    ApiResponse, Object, OpenApi, SecurityScheme,
};
use sea_orm::{DatabaseConnection, Set, EntityTrait, QueryFilter, ColumnTrait};
use serde::{Deserialize, Serialize};
use sha2::Sha256;
type ServerKey = Hmac<Sha256>;
use crate::{endpoints::tags::ApiTag, entity::user};

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenUser {
    pub id: i32,
    pub email: String,
}

/// ApiKey authorization
#[derive(SecurityScheme)]
#[oai(
    ty = "api_key",
    key_name = "X-API-Key",
    key_in = "header",
    checker = "api_checker"
)]
pub struct MyApiKeyAuthorization(pub TokenUser);

async fn api_checker(req: &Request, api_key: ApiKey) -> Option<TokenUser> {
    let server_key = req.data::<ServerKey>().unwrap();
    VerifyWithKey::<TokenUser>::verify_with_key(api_key.key.as_str(), server_key).ok()
}

#[derive(Object, Debug)]
struct SignupRequest {
    email: String,
    password: String,
    name: String,
}
#[derive(Object)]
struct LoginRequest {
    email: String,
    password: String,
}

#[derive(ApiResponse)]
enum LoginResponse {
    #[oai(status = 200)]
    Ok(PlainText<String>),
    #[oai(status = 401)]
    Unauthorized(PlainText<String>),
    #[oai(status = 404)]
    NotFound(PlainText<String>),
}

pub struct AuthApi;

#[OpenApi]
#[allow(unused_variables)]
impl AuthApi {
    #[oai(path = "/signup", method = "post", tag = "ApiTag::Auth")]
    async fn signup(
        &self,
        server_key: Data<&ServerKey>,
        db: Data<&DatabaseConnection>,
        req: Json<SignupRequest>,
    ) -> Result<LoginResponse> {
        let user = user::ActiveModel {
            email: Set(req.0.email.clone()),
            name: Set(req.0.name.clone()),
            password: Set(req.0.password.sign_with_key(server_key.0).map_err(InternalServerError)?),
            created_at: Set(chrono::Utc::now().naive_utc()),
            updated_at: Set(chrono::Utc::now().naive_utc()),
            ..Default::default()
        };
        let res = user::Entity::insert(user).exec(db.0).await.map_err(InternalServerError)?;

        let token = TokenUser {
            id: res.last_insert_id,
            email: req.0.email.clone(),
        }
        .sign_with_key(server_key.0)
        .map_err(InternalServerError)?;

        Ok(LoginResponse::Ok(PlainText(token)))
    }

    #[oai(path = "/login", method = "post", tag = "ApiTag::Auth")]
    async fn login(
        &self,
        server_key: Data<&ServerKey>,
        pool: Data<&DatabaseConnection>,
        req: Json<LoginRequest>,
    ) -> Result<LoginResponse> {
        let user = user::Entity::find()
            .filter(user::Column::Email.contains(req.0.email.clone()))
            .one(pool.0)
            .await
            .map_err(InternalServerError)?;
        // handle user not found
        let user = match user {
            Some(user) => user,
            None => return Ok(LoginResponse::NotFound(PlainText("User not found".to_string()))),
        };
        let signed_password = req.0.password.sign_with_key(server_key.0).map_err(InternalServerError)?;

        if user.password != signed_password {
            return Ok(LoginResponse::Unauthorized(PlainText("Unauthorized".to_string())));
        }
        
        let token = TokenUser {
            id: user.id,
            email: user.email,
        }
        .sign_with_key(server_key.0)
        .map_err(InternalServerError)?;

        Ok(LoginResponse::Ok(PlainText(token)))
    }

    #[oai(path = "/hello", method = "get", tag = "ApiTag::Auth")]
    async fn hello(&self, auth: MyApiKeyAuthorization) -> PlainText<String> {
        PlainText(auth.0.email)
    }
}
