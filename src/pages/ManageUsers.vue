<template>
  <section>
    <NavMain />
    <v-content style="clear: both;padding: 2%;margin:0;width: 100%">
      <hr><br>

      <v-dialog
        v-model="dialog"
        width="full"
      >
        <!-- Add Form -->
        <v-card class="pa-4 mb-4">
          <v-form @submit.prevent="addNew">
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field v-model="newUser.username" label="Username" required />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="newUser.email" label="Email" required />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="newUser.password" label="Password" required />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="newUser.telephone" label="Telephone" required />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="newUser.role"
                  :items="['ADMIN', 'NORMAL']"
                  label="Role"
                  required
                />
              </v-col>
            </v-row>
            <v-btn type="submit" color="primary" :loading="loadingAdd">Add User</v-btn>
          </v-form>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="edit"
        width="full"
      >
        <!-- Add Edit Form -->
        <v-card class="pa-4 mb-4">
          <v-form @submit.prevent="editRequest">
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field v-model="editUserData.username" label="Username" required />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="editUserData.email" label="Email" required />
              </v-col>
              <!-- <v-col cols="12" md="3">
                <v-text-field v-model="editUserData.password" label="Password" required />
              </v-col> -->
              <v-col cols="12" md="3">
                <v-text-field v-model="editUserData.telephone" label="Telephone" required />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="editUserData.role"
                  :items="['ADMIN', 'NORMAL']"
                  label="Role"
                  required
                />
              </v-col>
            </v-row>
            <v-btn type="submit" color="primary" :loading="loadingAdd">Edit User</v-btn>
          </v-form>
        </v-card>
      </v-dialog>

      <div>
        <v-text-field v-model="search" label="Search Users" class="mb-3" />

        <v-btn @click="dialog = true">
          Add User
        </v-btn>

        <h1 class="text-center">Users Module</h1>
        <br><br>
        <!-- result.findAllUsers -->
        <!-- filteredItems -->
        <v-data-table
          :items="filteredItems"
          :items-per-page="50"
          :headers="[
            { title: 'ID', key: 'id', sortable: true },
            { title: 'Status', key: 'status', sortable: true },
            { title: 'Username', key: 'username', sortable: true },
            { title: 'Email', key: 'email', sortable: true },
            { title: 'Telephone', key: 'telephone', sortable: true },
            { title: 'Role', key: 'role', sortable: true },
            { title: 'Actions', key: 'actions', sortable: false }
          ]"
          item-value="id"
          :loading="loading"
          @click:row="(event: any, { item }: any) => toggleSort(item.key)"
        >
          <template v-slot:loading>
            <v-progress-linear indeterminate />
          </template>
          <template v-slot:no-data>
            <p v-if="error">Error: {{ error.message }}</p>
            <p v-else>No items found.</p>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn style="margin-right: 20px;" color="success" @click="edit = true; id = item.id; editInit(item)">Edit</v-btn> 
            <v-btn style="margin-right: 20px;" v-show="item.status == 1" color="warning" @click="deactivateRequest(item.id)">Deactivate</v-btn>
            <v-btn style="margin-right: 20px;" v-show="item.status == 0" color="info" @click="activateRequest(item.id)">Activate</v-btn>
          </template>
        </v-data-table>
      </div>
    </v-content>
    <Footer />
  </section>
</template>

<script setup lang="ts">
  import NavMain from "@/components/Navs/NavMain.vue";
  import Footer from "@/components/Footers/Footer.vue";
  import { ref, computed } from 'vue';
  // @ts-ignore
  import { useMutation } from '@vue/apollo-composable';
  import {ADD_USER, SOFT_DELETE_USER_BY_ID, EDIT_USER, SOFT_ACTIVATE_USER_BY_ID} from "@/mutation/mutations";
  import { useQuery } from '@vue/apollo-composable';
  import {GET_ALL_USERS} from "@/query/queries";

  const { result, loading, error } = useQuery(GET_ALL_USERS, {
    clientId: "default", // Ensure you're using the correct client
  });

  // Reactive variables
  const search   = ref('');
  const sortBy   = ref('id');
  const sortDesc = ref(false);
  const dialog   = ref(false);
  const edit     = ref(false);
  const id       = ref('');
 
  // Computed: Filter users based on search
  const filteredItems = computed(() => {
    const users = result?.value?.findAllUsers || [];

    // Search filter (matches any field)
    return users.filter((user: { [s: string]: unknown; } | ArrayLike<unknown>) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(search.value.toLowerCase())
    );
  });

  // Handle column sorting
  const toggleSort = (column: string) => {
    if (sortBy.value === column) {
      sortDesc.value = !sortDesc.value; // Toggle direction
    } else {
      sortBy.value = column;
      sortDesc.value = false;
    }
  };

// Add user mutation
const { mutate: addUser, loading: loadingAdd } = useMutation(ADD_USER, {
  clientId: "default", 
});

// Edit mutation
// Edit mutation
const { mutate: editUser} = useMutation(EDIT_USER, {
  clientId: "default", 
});

// Activate mutation
const { mutate: activateUser} = useMutation(SOFT_ACTIVATE_USER_BY_ID, {
  clientId: "default", 
});

// Deactivate mutation
const { mutate: deactivateUser} = useMutation(SOFT_DELETE_USER_BY_ID, {
  clientId: "default", 
});

// Reactive state for new 
const newUser = ref({
  username: "",
  email: "",
  password: "",
  telephone: "",
  role: "",
});

// Reactive state for edit
const editUserData = ref({
  id: "",
  username: "",
  email: "",
  telephone: "",
  role: "NORMAL",
});

// Add function
const addNew = async () => {
  try {
    const response = await addUser({
      username: newUser.value.username,
      email: newUser.value.email,
      password: newUser.value.password,
      telephone: newUser.value.telephone,
      role: newUser.value.role,
    });

    newUser.value = { username: "", email: "", password: "", telephone: "", role: "" };

    location.reload();
  } catch (err) {
    console.error("Error adding user:", err);
  }
};

// Edit function
const editRequest = async () => {
  try {
    const response = await editUser({
      id: parseInt(editUserData.value.id),
      username: editUserData.value.username,
      email: editUserData.value.email,
      telephone: editUserData.value.telephone,
      role: editUserData.value.role,
    });

    // editedUserSuccess.value = 1;
    editUserData.value = { id: "", username: "", email: "", telephone: "", role: "" };
    // console.log(response);
    location.reload();
  } catch (err) {
    console.error("Error editing user:", err);
  }
};

// deactivate function
const deactivateRequest = async (userId: any) => {
  if (!userId) {
    console.error("Error: userId is null or undefined");
    return;
  }else{
    userId = parseInt(userId);
  }

  if (confirm("Are you sure you want to perform this action?")) {
    try {
      const response = await deactivateUser({
          id: userId, // Ensure it's an integer
      });

      console.log("User soft deactivate:", response);
      location.reload();
    } catch (error) {
      console.error("Error deactivate user:", error);
    }
  }
};

// activate function
const activateRequest = async (userId: any) => {
  if (!userId) {
    console.error("Error: userId is null or undefined");
    return;
  }else{
    userId = parseInt(userId);
  }

  if (confirm("Are you sure you want to perform this action?")) {
    try {
      const response = await activateUser({
          id: userId, // Ensure it's an integer
      });
      
      console.log("User soft activate:", response);
      location.reload();
    } catch (error) {
      console.error("Error activate user:", error);
    }
  }
};

// Edit init function
const editInit = async (item: any) => {
  editUserData.value.id = item.id;
  editUserData.value.username = item.username;
  editUserData.value.email = item.email;
  editUserData.value.telephone = item.telephone;
  editUserData.value.role = item.role;
};


</script>

<style scoped>
  .webBox{
    width: 100%;
  }

  .v-text-field {
    max-width: 300px;
  }
</style>
