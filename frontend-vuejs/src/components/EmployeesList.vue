<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter()
const apiUrl = import.meta.env.VITE_S3_IMG_URL
const employeeData = ref()

async function getData() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`)
    console.log(response.data)
    employeeData.value = response.data.data
  } catch (error) {
    console.log(error)
  }
}

async function deleteData(id_employee) {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/employees/delete/` + id_employee )
    console.log(response.data)
    router.push({ name: 'home' })
    await getData()
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getData()
})
</script>

<template>
  <h1 className="text-3xl font-bold text-blue-600 text-center mb-5">
    EMPLOYEES LIST
  </h1>
  <div class="flex justify-end mb-5">
    <RouterLink to="/addEmployee" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="">
      Add Employee
    </RouterLink>
  </div>
  <table class="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider bg-gray-500 text-white">
          Number
        </th>
        <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider bg-gray-500 text-white">
          Photo
        </th>
        <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider bg-gray-500 text-white">
          Id Employee
        </th>
        <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider bg-gray-500 text-white">
          Name
        </th>
        <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider bg-gray-500 text-white">
          Job
        </th>
        <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider bg-gray-500 text-white">
          Salary
        </th>
        <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider bg-gray-500 text-white">
          Action
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <template v-for="(data, index) in employeeData">
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-center">{{ index + 1 }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <img class="w-48" :src="`${apiUrl}/${data.photo}`" alt="Employee Photo" />
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center">{{ data.id_employee }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center">{{ data.nama }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center">{{ data.job }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center">{{ data.salary }}</td>
          <td class="text-center">
            <!-- <RouterLink :to="{name: 'UpdateEmployee', params: { id: data.id_employee}}" class="bg-yellow-500 text-white px-4 py-2 rounded-full mx-1">Update</RouterLink> -->
            <RouterLink to="/" class="bg-red-500 text-white px-4 py-2 rounded-full mx-1" @click="deleteData(data.id_employee)">Delete</RouterLink>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
