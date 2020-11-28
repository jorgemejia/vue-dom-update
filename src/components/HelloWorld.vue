<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-data-table
          :headers="headers"
          :items="users"
          :items-per-page="5"
          class="elevation-1"
      >
        <template v-slot:item="{item}">
          <tr>
            <td>{{item.name}}</td>
            <td>{{item.lastnameFather}}</td>
            <td>{{item.lastnameMother}}</td>
            <td>{{item.email}}</td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" icon @click="userEdit" v-on="on">
                    <v-icon>mdi-checkbox-marked-circle</v-icon>
                  </v-btn>
                </template>
                <span>Nuevo</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" icon @click="userEdit(item)" v-on="on">
                    <v-icon>mdi-wrench</v-icon>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" icon @click="userDelete(item)" v-on="on">
                    <v-icon>mdi-cancel</v-icon>
                  </v-btn>
                </template>
                <span>Delete</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-row>

    <template>
      <v-row justify="center">
        <v-dialog
            v-model="dialog"
            persistent
            max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">User Profile</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                        label="Legal first name*"
                        required
                        v-model="userSelected.name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        label="Legal middle name"
                        hint="example of helper text only on focus"
                        v-model="userSelected.lastnameMother"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        label="Legal last name*"
                        hint="example of persistent helper text"
                        persistent-hint
                        v-model="userSelected.lastnameFather"
                        required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        label="Email*"
                        required
                        v-model="userSelected.email"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="closeModal"
              >
                Close
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="saveUSer"
              >
                {{ userSelected.id ? 'Update' : 'Save' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>


  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { userService } from "@/services/user.service";
import { UserInterface } from "@/types/User.interface";

@Component
export default class HelloWorld extends Vue {
  public name: string = "HelloWorld";
  public users: UserInterface[] = [];
  public dialog: boolean = false;
  public userSelected: UserInterface = {
    id: 0,
    name: '',
    lastnameFather: '',
    lastnameMother: '',
    email: '',
    password: '123456'
  };

  public headers: any = [
    { text: "Nombre", value: "name" },
    { text: "Apellido Paterno", value: "lastnameFather" },
    { text: "Apellido Materno", value: "lastnameMother" },
    { text: "Email", value: "email" },
    { text: "Acciones", value: "" }
  ];

  async mounted() {
    const response = await userService.getUsuarios();
    this.users = response;
    console.log(this.users);
  }

  public openModal() {
    this.dialog = true;
  }

  public async userEdit(item: UserInterface) {
    this.dialog = true;
    this.userSelected = item;
  }

  public async userDelete(user: UserInterface) {
    const response =  await userService.deleteUsuarios(user);
    const index = this.users.indexOf(user);
    if( index > -1 ){
      this.users.splice(index, 1);
    }
  }

  public async saveUSer() {

    if( this.userSelected.id ) {
      const user = await userService.updateUsuarios( this.userSelected );
      const index:number = this.users.indexOf(this.userSelected);
      if( index > -1 ){
        this.users[index] = user;
      }

      this.dialog = false;

    } else {
      this.userSelected.password = 'ADCDEFG';
      const user: UserInterface = await userService.createUsuarios( this.userSelected );
      this.users.push(user);
      this.dialog = false;
    }
  }

  public clearUser() {
    this.userSelected = {
      id: 0,
      name: '',
      lastnameFather: '',
      lastnameMother: '',
      email: '',
      password: ''
    }
  }

  public closeModal() {
    this.dialog = false;
    this.clearUser();
  }

};
</script>
