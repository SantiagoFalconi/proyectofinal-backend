import { faker } from '@faker-js/faker/locale/es_MX'

export const mockProducts = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        code: faker.string.alphanumeric(5),
        stock: faker.number.int({min: 1, max: 100}),
        category: faker.commerce.productDescription(),
    }
}