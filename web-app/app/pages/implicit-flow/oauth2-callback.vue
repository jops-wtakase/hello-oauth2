<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import RouterUtil from '~/utils/router-util.ts'

  const accessTokenRef = ref<string>()
  const urlRef = ref<string>()
  const getTodosResponseRef = ref<object>()
  const todoDescriptionRef = ref<string>()
  const addTodoResponseRef = ref<object>()

  const { goToTop } = RouterUtil()

  const useGetTodos = async () => {
    getTodosResponseRef.value = await $fetch('/api/getTodos', {
      method: 'POST',
      body: { accessToken: accessTokenRef.value }
    })
  }

  const useAddTodo = async () => {
    if (!todoDescriptionRef.value) return
    addTodoResponseRef.value = await $fetch('/api/addTodo', {
      method: 'POST',
      body: { accessToken: accessTokenRef.value, description: todoDescriptionRef.value }
    })
  }

  onMounted(async () => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.substring(1))
    urlRef.value = document.location.href
    const accessToken = params.get('access_token')
    accessTokenRef.value = accessToken || ''
  })
</script>
<template>
  <div>
    <button @click="goToTop">Topへ戻る</button>
  </div>
  <div>
    <h1>Implicitフロー: 認証結果</h1>
    <div>
      <h2>アクセストークン</h2>
      <div>{{ accessTokenRef }}</div>
      <div class="code-container">
        <div class="language-label">url</div>
        <pre><code>{{ urlRef }}</code></pre>
      </div>
    </div>
    <div v-if="accessTokenRef">
      <h1>アクセストークンを使ってリソースサーバからTODO情報取得</h1>
      <button @click="useGetTodos">TODO情報の取得</button>
      <div v-if="getTodosResponseRef">
        <h3>レスポンス:</h3>
        <div><pre>{{ JSON.stringify(getTodosResponseRef, null, 2) }}</pre></div>
      </div>
    </div>
    <div v-if="accessTokenRef">
      <h1>アクセストークンを使ってリソースサーバにTODO情報追加</h1>
      <input v-model="todoDescriptionRef" type="text" />
      <button @click="useAddTodo">TODO情報の追加</button>
      <div v-if="addTodoResponseRef">
        <h3>レスポンス:</h3>
        <div><pre>{{ JSON.stringify(addTodoResponseRef, null, 2) }}</pre></div>
      </div>
    </div>
  </div>
</template>
