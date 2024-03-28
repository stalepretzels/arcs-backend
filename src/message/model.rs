use serde::{Deserialize, Serialize};
use std::str::FromStr;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "snake_case")]
pub enum MessageType {
    MessageSent,
    RetrieveMessages,
    RoomJoin,
    RoomLeave,
    UserJoin,
    UserLeave,
    ChangeUserData // Implement this later!
}

impl FromStr for MessageType {

    type Err = ();

    fn from_str(input: &str) -> Result<MessageType, Self::Err> {
        match input {
            "message_sent"  => Ok(MessageType::MessageSent),
            "room_join"  => Ok(MessageType::RoomJoin),
            "room_leave"  => Ok(MessageType::RoomLeave),
            "change_user_data" => Ok(MessageType::ChangeUserData),
            "user_join"  => Ok(MessageType::UserJoin),
            "user_leave"  => Ok(MessageType::UserLeave),
            _      => Err(()),
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MessageModel {
    // Message typing so the client and server know what they should do with results
    #[serde(rename="type")]
    pub msgtype: MessageType 
    
    // Make params with aliases for each message type
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(alias="msg")]
    pub param1: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(alias="user")]
    pub param2: String,
}