use serde::{Deserialize, Serialize};

enum MessageType {
    MessageSent,
    RoomJoin,
    RoomLeave,
    ChangeUserData // Implement this later!
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MessageModel {
    pub msg: String,
    pub name: String,
    //type: MessageType
}
