<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import LessonStatus from './components/LessonStatus.vue'
import LessonQuiz from './components/LessonQuiz.vue'

const { Layout: DefaultLayout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <DefaultLayout>
    <!--
      课件 Markdown 里不含任何自定义标签：这里靠 frontmatter 的 lessonId 判断，
      自动把状态条和答题器挂到每一课的正文前后。
      60 个课件下这消除了 60 个可能写错标签的地方。
    -->
    <template #doc-before>
      <LessonStatus v-if="frontmatter.lessonId" :lesson-id="frontmatter.lessonId" />
    </template>

    <template #doc-after>
      <LessonQuiz v-if="frontmatter.lessonId" :lesson-id="frontmatter.lessonId" />
    </template>
  </DefaultLayout>
</template>
