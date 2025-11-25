<script setup lang="ts">
import TaskDateItem from "./TaskDateItem.vue";
</script>

<template>
  <div class="flex flex-col gap-4 text-sm">
    <div>
      <ul class="flex flex-col gap-1">
        <li>
          <TaskDateItem taskDate="#" :active="true">Today</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Yesterday</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Sunday, July 27</TaskDateItem>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-3">
      <p class="text-xs text-gray-500 px-4">Last Week</p>
      <ul class="flex flex-col gap-1">
        <li>
          <TaskDateItem taskDate="#">Saturday, July 26</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Friday, July 25</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Thursday, July 24</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Wednesday, July 23</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Tuesday, July 22</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Monday, July 21</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Sunday, July 20</TaskDateItem>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-3">
      <p class="text-xs text-gray-500 px-4">3rd Week of July</p>
      <ul class="flex flex-col gap-1">
        <li>
          <TaskDateItem taskDate="#">Saturday, July 19</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Friday, July 18</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Thursday, July 17</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Wednesday, July 16</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Tuesday, July 15</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Monday, July 14</TaskDateItem>
        </li>
        <li>
          <TaskDateItem taskDate="#">Sunday, July 13</TaskDateItem>
        </li>
      </ul>
    </div>
  </div>
</template>
