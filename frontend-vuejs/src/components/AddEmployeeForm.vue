<script setup>
import { ref } from "vue";
import axios from "axios";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const form = ref({
    nama: "",
    job: "",
    salary: "",
});

const handleFileUpload = (event) => {
    form.value.photo = event.target.files[0]
}

const isLoading = ref(false)
const addEmployee = async () => {
    isLoading.value = true
    try {
        const formData = new FormData()
        formData.append('nama', form.value.nama)
        formData.append('job', form.value.job)
        formData.append('salary', form.value.salary)
        formData.append('photo', form.value.photo)

        // Melakukan POST request ke backend API
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/employees`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )

        console.log(response.data)

        // Redirect ke halaman "home" setelah sukses
        router.push({ name: 'home' })
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="max-w-md mx-auto">
        <form @submit.prevent="addEmployee()" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                    Name
                </label>
                <input
                    class="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    v-model="form.nama" id="name" type="text" />
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                    Job
                </label>
                <input
                    class="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    v-model="form.job" id="job" type="text" />
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                    Salary
                </label>
                <input
                    class="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    v-model="form.salary" id="salary" type="text" />
            </div>
            <div class="mb-4">
                <label for="photo">Photo</label>
                <input type="file" accept="image/*" @change="handleFileUpload" />
            </div>
            <div class="flex items-center justify-between">
                <button
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit" :disabled="isLoading">
                    <span v-if="isLoading">Loading...</span>
                    <span v-else>Submit</span>
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
