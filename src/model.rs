use serde::{Deserialize, Serialize};
use std::str::FromStr;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "snake_case")]
pub enum MessageType {
    MessageSent,
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
    pub msg: String,
    pub name: String,
    #[serde(alias="type")]
    pub msgtype: MessageType
}