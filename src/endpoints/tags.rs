use poem_openapi::Tags;

#[derive(Tags)]
pub enum ApiTag {
    Tasks,
    Auth,
}