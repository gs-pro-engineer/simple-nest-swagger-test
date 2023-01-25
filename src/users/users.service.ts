import { Injectable } from '@nestjs/common';
const fs = require('fs');

type User = {
  userId: number,
  username: string,
  password: string,
  accessToken: string,
  refreshToken: string,
}

@Injectable()
export class UsersService {
  async findUser(username: string): Promise<User> {
    try {
      const jsonString = await fs.readFileSync("src/users/users.json", { encoding: "utf8" });
      const data = JSON.parse(jsonString);
      return data.find(user => user.username === username);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
      return;
    }
  }

  async updateTokens(userId: number, tokens: any): Promise<Boolean> {
    try {
      const jsonString = await fs.readFileSync("src/users/users.json", { encoding: "utf8" });
      let users = JSON.parse(jsonString);
      const index = users.findIndex(user => user.userId === userId);
      users[index].accessToken = tokens.hashedAccessToken;
      users[index].refreshToken = tokens.hashedRefreshToken;
      const updatedJsonString = JSON.stringify(users);
      let err = await fs.writeFileSync("src/users/users.json", updatedJsonString);
      return true;
    } catch (err) {
      console.log("Error parsing JSON string:", err);
      return false;
    }
  }
}
