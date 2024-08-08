<template>
    <div class="page-container">
        <main class="container-main">
            <section class="container-filters">
                <InputDropdown 
                    class="container-filters__item"
                    v-model="selectedParams.mark"
                    :optionsList="carMarks || undefined"
                    label="Марка машины"
                />
                <InputDropdown 
                    class="container-filters__item"
                    v-model="selectedParams.model"
                    :disabled="!selectedParams.mark"
                    :optionsList="carModels || undefined"
                    label="Модель машины"
                />
                <InputDropdown 
                    class="container-filters__item"
                    v-model="selectedParams.modification"
                    :disabled="!selectedParams.model"
                    :optionsList="carModifications || undefined"
                    label="Модификация машины"
                />
            </section>
            <section v-if="foundWipers?.length" class="container-wipers">
                <div v-for="wiper in foundWipers" class="container-wipers__items">
                    <div class="container-wipers__len1">{{ `Длина щётки со стороны водителя: ${wiper?.length1}` }}</div>
                    <div class="container-wipers__len2">{{ `Длина щётки со стороны пассажира: ${wiper?.length2}` }}</div>
                    <div class="container-wipers__len3">{{ `Длина задней щётки: ${wiper?.length3}` }}</div>
                    <div class="container-wipers__len3">{{ `Тип крепления: ${wiper?.fasten}` }}</div>
                </div>
            </section>
            <section v-else class="container-wipers-error">
                Результатов не найдено...
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">

const store = useMainStore()

const selectedParams = reactive({
    mark: '',
    model: '',
    modification: ''
})

const foundWipers = ref<WiperDetailResponse[]>()

const { data: carMarks } = await useAsyncData<CarDetailsResponse[]>(
    'marks',
    () => $fetch(store.baseUrl + '/wipers/auto', {
        method: 'GET'
    }),
    {
        transform: (data) => {
            data.forEach((i: CarDetailsResponse) => {
                i.value = i.id
            })
            return data
        }
    },
)

const {data : carModels} = await useAsyncData<CarDetailsResponse[]>(
    'models',
    () => $fetch(store.baseUrl + `/wipers/model/${selectedParams.mark}`, {
        method: 'GET', 
    }), {
            transform: (data) => {
                data.forEach((i : CarDetailsResponse) => {
                    i.value = i.id
                })
                return data
            },
            watch: [selectedParams]   
    },
)

const {data : carModifications} = await useAsyncData<CarDetailsResponse[]>(
    'modifications',
    () => $fetch(store.baseUrl + `/wipers/modif/${selectedParams.model}`, {
        method: 'GET', 
    }), {
            transform: (data) => {
                data.forEach((i : CarDetailsResponse) => {
                    i.value = i.id
                })
                return data
            },
            watch: [selectedParams]   
    },
)

function getWipers(){
    if (selectedParams.modification){
        $fetch(store.baseUrl + `/wipers/param/${selectedParams.modification}`, {
            method: 'GET',
            onResponse({response}){
                foundWipers.value = response._data
            }
        }
        )
    }
}

watch(() => selectedParams.modification, () => {
    getWipers()
})

watch(() => selectedParams.mark, () => {
    selectedParams.model = ''
    selectedParams.modification = ''
    foundWipers.value = []
})

watch(() => selectedParams.model, () => {
    selectedParams.modification = ''
    foundWipers.value = []
})

</script>