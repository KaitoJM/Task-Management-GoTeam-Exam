<script setup lang="ts">
import TaskDateItem from "./TaskDateItem.vue";
</script>

<template>
  <div class="flex flex-col gap-4 text-sm">
    <div>
      <ul class="flex flex-col">
        <li>
          <TaskDateItem :active="true">Today</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Yesterday</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Sunday, July 27</TaskDateItem>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-3">
      <p class="text-xs text-gray-500 px-4">Last Week</p>
      <ul class="flex flex-col gap-2">
        <li>
          <TaskDateItem>Saturday, July 26</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Friday, July 25</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Thursday, July 24</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Wednesday, July 23</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Tuesday, July 22</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Monday, July 21</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Sunday, July 20</TaskDateItem>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-3">
      <p class="text-xs text-gray-500 px-4">3rd Week of July</p>
      <ul class="flex flex-col gap-2">
        <li>
          <TaskDateItem>Saturday, July 19</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Friday, July 18</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Thursday, July 17</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Wednesday, July 16</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Tuesday, July 15</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Monday, July 14</TaskDateItem>
        </li>
        <li>
          <TaskDateItem>Sunday, July 13</TaskDateItem>
        </li>
      </ul>
    </div>
  </div>
</template>
