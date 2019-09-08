class Users {
    constructor() {
        this.users = [];
    }
    AddUserData(id, name, room) {
        var users = { id, name, room };
        this.users.push(users);
        return users;
    }
    RemoveUser(id) {
        var user = this.GetUser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }
    GetUser(id) {
        var gerUser = this.users.filter((userid) => {
            return userid.id === id
        })[0];
        return gerUser;
    }
    GetUsersList(room) {
        var users = this.users.filter((user) => user.room === room)
        var nameArray = users.map((user) => {
            return user.name;
        });
        return nameArray;
    }
}
module.exports = { Users }