<template>
    <div class="select-block">
        <select 
            class="select-block__picker" 
            :disabled="props.disabled" 
            :autocomplete="props.autocomplete"
            @change="updateSelect"
            v-model="selectedItem"
            >
                <option value="" class="select-block__option" default selected> 
                    {{ props.label }}
                </option>
                <option v-for="option in optionsList" :value="option.value" class="select-block__option">
                    {{ option.name }}
                </option>
        </select>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    label: {
        type: String,
        required: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    autocomplete: {
        type: String,
        default: 'on'
    },
    optionsList : {
        type: Array<DropdownOption>,
        required: false
    }

})
const selectedItem = ref<String | Number>('')
const emit = defineEmits(['update:modelValue'])

function updateSelect(){
    emit('update:modelValue', selectedItem.value)
}

</script>

<style scoped lang="scss">

.select-block{
    .select-block__picker{
        .select-block__option[default]{
            display: none;
        }
    }
}

</style>