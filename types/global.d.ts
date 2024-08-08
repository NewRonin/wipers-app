export {}

declare global {
    type DropdownOption = {
        name: string,
        value: string | number
    }

    type CarDetailsResponse = {
        name: string,
        value: string | number,
        id: string | number
    }

    type WiperDetailResponse = {
        length1: string,
        length2: string,
        length3: string,
        fasten: string
    }
}