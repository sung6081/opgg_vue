<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center pt-24">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">회원가입</h2>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">이름</label>
          <input v-model="name" type="text" required class="w-full mt-1 p-2 border rounded-md" />
        </div>

        <div>
          <label class="block text-sm font-medium">비밀번호</label>
          <input v-model="password" type="password" required class="w-full mt-1 p-2 border rounded-md" />
        </div>

        <div>
          <label class="block text-sm font-medium">비밀번호 확인</label>
          <input v-model="passwordConfirm" type="password" required class="w-full mt-1 p-2 border rounded-md" />
        </div>

        <div>
          <label class="block text-sm font-medium">전화번호</label>
          <input v-model="cellPhone" type="text" placeholder="010-1234-5678" required class="w-full mt-1 p-2 border rounded-md" />
        </div>

        <div class="flex gap-2">
          <div class="w-full">
            <label class="block text-sm font-medium">이메일</label>
            <input v-model="email" type="email" required class="w-full mt-1 p-2 border rounded-md" />
          </div>
          <button type="button" @click="checkEmail" class="mt-6 h-10 px-4 text-sm bg-gray-200 rounded-md hover:bg-gray-300">
            중복확인
          </button>
          <button type="button" @click="sendVerification" class="mt-6 h-10 px-4 text-sm bg-blue-200 rounded-md hover:bg-blue-300">
            인증메일
          </button>
        </div>

        <button type="submit" :disabled="!canSubmit" class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
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

      isEmailChecked: false,
      isEmailDuplicated: true,
      isEmailVerified: false,
    }
  },
  computed: {
    canSubmit() {
      return (
        this.isEmailChecked &&
        !this.isEmailDuplicated &&
        this.isEmailVerified &&
        this.password === this.passwordConfirm
      );
    },
  },
  methods: {
    async checkEmail() {
      try {
        const response = await axios.get(`http://localhost:8080/user/checkEmail`, {
          params: { email: this.email },
        });
        this.isEmailChecked = true;
        this.isEmailDuplicated = response.data;
        if (this.isEmailDuplicated) {
          alert('이미 존재하는 이메일입니다.');
        } else {
          alert('사용 가능한 이메일입니다.');
        }
      } catch (error) {
        console.error(error);
        alert('이메일 중복 확인 실패');
      }
    },

    async sendVerification() {
      try {
        const response = await axios.post(`http://localhost:8080/user/sendVerification`, {
          email: this.email,
        });
        alert(response.data);
        this.isEmailVerified = true;
      } catch (error) {
        console.error(error);
        alert(error.response?.data || '이메일 인증 요청 실패');
      }
    },

    async submitForm() {
      if (this.password !== this.passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      if (!this.canSubmit) {
        alert('이메일 중복 확인 및 인증을 먼저 진행해주세요.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/user/addUser', {
          name: this.name,
          password: this.password,
          cellPhone: this.cellPhone,
          email: this.email,
        });
        alert(response.data);
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
        alert('회원가입 실패');
      }
    }
  },
}
</script>

<style scoped>
/* 필요한 경우 추가 스타일 작성 */
</style>
