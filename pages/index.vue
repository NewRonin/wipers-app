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
            <transition-group name="fade">
                <section v-if="foundWipers?.length" class="container-wipers">
                    <div v-for="(wiper, index) in foundWipers" class="container-wipers__items">
                            <div class="container-wipers__variant"> {{ `Вариант: ${index+1}:` }} </div>
                            <div class="container-wipers__len1">{{ `Длина щётки со стороны водителя: ${wiper?.length1}` }}</div>
                            <div class="container-wipers__len2">{{ `Длина щётки со стороны пассажира: ${wiper?.length2}` }}</div>
                            <div class="container-wipers__len3">{{ `Длина задней щётки: ${wiper?.length3}` }}</div>
                            <div class="container-wipers__len3">{{ `Тип крепления: ${wiper?.fasten}` }}</div>
                    </div>
                </section>
                <section v-else class="container-wipers-error">
                    <div class="container-wipers-error__item" v-if="selectedParams.modification && !loading && !foundWipers?.length">
                        Результатов не найдено...
                    </div>
                    <div class="container-wipers-error__item" v-else>
                        Введите больше параметров для поиска
                    </div>
                </section>
            </transition-group>
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

const loading = ref(false)

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

async function getWipers(){
    loading.value = true
    if (selectedParams.modification){
        await $fetch(store.baseUrl + `/wipers/param/${selectedParams.modification}`, {
            method: 'GET',
            onResponse({response}){
                foundWipers.value = response._data
                loading.value = false
            },
        })
    }
    loading.value = false
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

<style scoped lang="scss">

.page-container{
    display: flex;
    width: 100dvw;
    height: 100dvh;

    .container-main{
        width: 100%;
        height: 100%;
        padding: 40px;
        .container-filters{
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-start;
            align-items: center;
            gap: 12px;

            width: 100%;
            padding: 16px;
            background-color: var(--app-black);
            border-radius: 4px;
            
        }
        .container-wipers{
            padding-top: 32px;
            display: flex;
            flex-flow: row wrap;
            gap: 16px;

            .container-wipers__items{
                padding: 16px;
                filter: drop-shadow(5px 5px 10px var(--app-black));
                background-color: var(--app-black);
                color: var(--app-white);
                border-radius: 4px;

                width: fit-content;
                .container-wipers__variant{
                    padding-bottom: 20px;
                    font-size: 32px;
                }
            }
        }

        .container-wipers-error{
            padding-top: 32px;
            padding-left: 16px;
            font-size: 42px;
        }
    }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
  position: absolute;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
}

</style>