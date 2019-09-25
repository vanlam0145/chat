class Global {
    constructor() {
        this.globalRoom = [];
    }
    EnterRoom(id,name,room,img,email){
        var roomName={id,name,room,img,email};
        this.globalRoom.push(roomName);
        return roomName;
    }
    GetRoomList(room){
        var roomName=this.globalRoom.filter((user)=>user.room=room);
        var nameArray=roomName.map(user=>{
            return {
                name:user.name,
                img:user.img,
                email:user.email
            }
        });
        return nameArray;
    }
}
module.exports = { Global }