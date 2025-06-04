<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center pt-24">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">회원가입</h2>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">이름</label>
          <input v-model="name" type="text" required class="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium">비밀번호</label>
          <input v-model="password" type="password" required class="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium">비밀번호 확인</label>
          <input v-model="passwordConfirm" type="password" required class="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium">전화번호</label>
          <input v-model="cellPhone" type="text" placeholder="010-1234-5678" required class="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="flex gap-2">
          <div class="w-full">
            <label class="block text-sm font-medium">이메일</label>
            <input v-model="email" type="email" required class="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="button" @click="checkEmail" class="mt-6 h-10 px-4 text-sm bg-gray-200 rounded-md hover:bg-gray-300">
            중복확인
          </button>
        </div>

        <button type="submit" class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          회원가입
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SignupPage',
  data() {
    return {
      name: '',
      password: '',
      passwordConfirm: '',
      cellPhone: '',
      email: '',
    }
  },
  methods: {
    async submitForm() {
      if (this.password !== this.passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.')
        return
      }

      try {
        const response = await axios.post('http://localhost:8080/user/addUser', {
          name: this.name,
          password: this.password,
          cellPhone: this.cellPhone,
          email: this.email,
        })
        alert(response.data) // 예: "회원가입 성공!"
        this.$router.push('/login') // 로그인 페이지로 이동
      } catch (error) {
        console.error(error)
        alert('회원가입 실패')
      }
    },

    async checkEmail() {
      // 여기는 서버에 이메일 중복 확인 API 있을 때 구현 가능
      alert('이메일 중복 확인 기능은 아직 구현되지 않았습니다.')
    },
  },
}
</script>

<style scoped>
/* 필요한 경우 여기에 추가 스타일 작성 가능 */
</style>
