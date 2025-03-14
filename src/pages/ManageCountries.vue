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
          <v-form @submit.prevent="addNewRequest">
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field v-model="newData.name" label="Name" required />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="newData.status"
                  :items="['0', '1']"
                  label="Status"
                  required
                />
              </v-col>
            </v-row>
            <v-btn type="submit" color="primary" :loading="loadingAdd">Add Country</v-btn>
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
                <v-text-field v-model="editData.name" label="Name" required />
              </v-col>
            </v-row>
            <v-btn type="submit" color="primary" :loading="loadingAdd">Edit Country</v-btn>
          </v-form>
        </v-card>
      </v-dialog>

      <div>
        <v-text-field v-model="search" label="Search Countries" class="mb-3" />

        <v-btn @click="dialog = true">
          Add Country
        </v-btn>

        <h1 class="text-center">Country Module</h1>
        <br><br>
        <!-- filteredItems -->
        <v-data-table
          :items="filteredItems"
          :items-per-page="50"
          :headers="[
            { title: 'ID', key: 'id', sortable: true },
            { title: 'Status', key: 'status', sortable: true },
            { title: 'Name', key: 'name', sortable: true },
            { title: 'Name', key: 'name', sortable: true },
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
  import {ADD_COUNTRY, SOFT_DELETE_COUNTRY_BY_ID, EDIT_COUNTRY, SOFT_ACTIVATE_COUNTRY_BY_ID} from "@/mutation/mutations";
  import { useQuery } from '@vue/apollo-composable';
  import {GET_ALL_COUNTRIES} from "@/query/queries";

  const { result, loading, error } = useQuery(GET_ALL_COUNTRIES, {
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
    const countries = result?.value?.findAllCountries || [];

    // Search filter (matches any field)
    return countries.filter((countries: { [s: string]: unknown; } | ArrayLike<unknown>) =>
      Object.values(countries)
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

// Add author mutation
const { mutate: addDataRequestCall, loading: loadingAdd } = useMutation(ADD_COUNTRY, {
  clientId: "default", 
});

// Edit mutation
const { mutate: editDataRequestCall} = useMutation(EDIT_COUNTRY, {
  clientId: "default", 
});

// Activate mutation
const { mutate: activateRequestCall} = useMutation(SOFT_ACTIVATE_COUNTRY_BY_ID, {
  clientId: "default", 
});

// Deactivate mutation
const { mutate: deactivateRequestCall} = useMutation(SOFT_DELETE_COUNTRY_BY_ID, {
  clientId: "default", 
});

// Reactive state for new 
const newData = ref({
  name: "",
  status: "",
});

// Reactive state for edit
const editData = ref({
  id: "",
  name: "",
  status: "",
});

// Add function
const addNewRequest = async () => {
  try {
    const response = await addDataRequestCall({
      name: newData.value.name,
      status: parseInt(newData.value.status),
    });

    newData.value = { name: "", status: ""};

    location.reload();
  } catch (err) {
    console.error("Error adding country:", err);
  }
};

// Edit function
const editRequest = async () => {
  try {
    const response = await editDataRequestCall({
      id: parseInt(editData.value.id),
      name: editData.value.name,
      status: parseInt(editData.value.status),
    });

    editData.value = { id: "", name: "", status: "" };
    location.reload();
  } catch (err) {
    console.error("Error editing country:", err);
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
      const response = await deactivateRequestCall({
          id: userId, // Ensure it's an integer
      });

      console.log("User soft deactivate:", response);
      location.reload();
    } catch (error) {
      console.error("Error deactivate country:", error);
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
      const response = await activateRequestCall({
          id: userId, // Ensure it's an integer
      });
      
      console.log("User soft activate:", response);
      location.reload();
    } catch (error) {
      console.error("Error activate country:", error);
    }
  }
};

// Edit init function
const editInit = async (item: any) => {
  editData.value.id = item.id;
  editData.value.name = item.name;
  editData.value.status = item.status;
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
