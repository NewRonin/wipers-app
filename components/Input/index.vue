<template>
    <div class="input-block">
        <input 
        class="input-block__element" 
        :disabled="props.disabled" :type="props.type"
        :autocomplete="props.autocomplete" 
        :name="props.name" 
        :placeholder="props.placeholder" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    type: {
        type: String,
        default: 'text'
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    autocomplete: {
        type: String,
        default: 'on'
    },
    name: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    }
})
</script>