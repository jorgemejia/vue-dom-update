import axios, { AxiosInstance } from "axios";
import { UserInterface } from "@/types/User.interface";

class UserService {
  public async getUsuarios() {
    return await axios
      .get<UserInterface[]>("http://localhost:3001/users")
      .then(response => response.data);
  }

  public async createUsuarios(user: UserInterface) {
    return await axios
        .post<UserInterface>(`http://localhost:3001/users`, user)
        .then(response => response.data);
  }

  public async updateUsuarios(user: UserInterface) {
    return await axios
        .patch<UserInterface>(`http://localhost:3001/users/${user.id}`, user)
        .then(response => response.data);
  }

  public async deleteUsuarios(user: UserInterface) {
    return await axios
        .delete(`http://localhost:3001/users/${user.id}`)
        .then(response => response.data);
  }



}

export const userService = new UserService();
