import { faker } from "@faker-js/faker";

export function generateNewUser() {
  return {
    name: faker.person.fullName(),
    email: `qa.${Date.now()}.${faker.string.alphanumeric(5)}@example.com`,
    password: faker.internet.password({ length: 10 }),
  };
}

export function generateAccountDetails() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    address: faker.location.streetAddress(),
    country: "United States",
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode("#####"),
    mobileNumber: faker.string.numeric(10),
  };
}

export function generatePaymentDetails() {
  return {
    nameOnCard: faker.person.fullName(),
    cardNumber: "4242424242424242",
    cvc: "123",
    expiryMonth: "12",
    expiryYear: "2030",
  };
}
