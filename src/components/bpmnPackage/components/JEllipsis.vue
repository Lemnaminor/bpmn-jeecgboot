<template>
  <a-tooltip placement="topLeft">
    <template slot="title">
      <span>{{value}}</span>
    </template>
    {{ value | ellipsis(length) }}
  </a-tooltip>
</template>

<script>
export default {
  name: "JEllipsis",
  props: {
    value: {
      type: String,
      required: false,
    },
    length: {
      type: Number,
      required: false,
      default: 25,
    },
  },
  filters: {
    ellipsis(value, vlength = 25) {
      if (!value) {
        return "";
      }
      console.log("vlength: " + vlength);
      if (value.length > vlength) {
        return value.slice(0, vlength) + "...";
      }
      return value;
    },
  },
};
</script>

<style scoped>
</style>
