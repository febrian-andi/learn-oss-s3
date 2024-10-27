<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const form = ref({})

async function getDataById() {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/employees/` + route.params.id)
            // `http://localhost:3000/employees/${route.params.id}`)
        console.log(response.data)
        form.value = response.data.data[0]
    } catch (error) {
        console.log(error.response.data)
    }
}

async function updateData() {
    try {
        const response = await axios.put(
            'http://localhost:3000/employees/update/' + route.params.id,
            {
                name: form.value.nama,
                job: form.value.job,
                salary: form.value.salary
            })
            router.push({ name: 'home' })
    } catch (error) {
        console.log(error.response.data)
    }
}

onMounted(() => {
    getDataById()
    
})

</script>

<template>
    <div class="max-w-md mx-auto">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                    Name
                </label>
                <input
                    class="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    v-model="form.nama" id="name" type="text">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="job">
                    Job
                </label>
                <input
                    class="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    v-model="form.job" id="job" type="text">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="salary">
                    Salary
                </label>
                <input
                    class="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    v-model="form.salary" id="salary" type="text">
            </div>
            <div class="flex items-center justify-between">
                <button
                    class="bg-green-500 hover-bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button" @click="updateData">
                    Submit
                </button>
                <RouterLink to="/"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button">
                    Back
                </RouterLink>
            </div>
        </form>
    </div>
</template>
