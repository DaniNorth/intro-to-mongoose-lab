const mongoose = require('mongoose');
const dotenv = require('dotenv');
const promptSync = require('prompt-sync');
const prompt = promptSync({ sigint: true });
const Customer = require('./models/customer');

dotenv.config();

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await runProgram();
    await mongoose.disconnect();
    process.exit();
};

const createCustomer = async () => {
    const name = prompt('Please enter the customer name: ');
    const age = prompt('Please enter the customer age: ');
    const location = prompt('Please enter your current city: ');

    await Customer.create({ name, age, location });

    console.log('Customer created successfully');
};

const viewCustomers = async () => {
    const customers = await Customer.find({});
    if (customers.length === 0) {
        console.log('There are no customers in the database');
        return;
    }
    customers.forEach(cust => {
        console.log(`id: ${cust._id} -- Name: ${cust.name}, Age: ${cust.age}, Location: ${cust.location || 'Not provided'}`);
    });
};

const updateCustomer = async () => {
    await viewCustomers();
    const id = prompt('Copy and paste the ID of the customer you would like to update here: ');
    const name = prompt('What is the customer’s new name? ');
    const age = prompt('What is the customer’s new age? ');
    const location = prompt('What is the customer’s new location? ');

    await Customer.findByIdAndUpdate(id, { name, age, location });
    console.log('Customer updated successfully!');
};

const deleteCustomer = async () => {
    await viewCustomers();
    const id = prompt('Copy and paste the ID of the customer you would like to delete here: ');
    await Customer.findByIdAndDelete(id);
    console.log('Customer deleted successfully!');
};

const runProgram = async () => {
    while (true) {
        const command = parseInt(prompt(`
        Welcome to the CRM
        
        What would you like to do?
        
        1. Create a customer
        2. View all customers
        3. Update a customer
        4. Delete a customer
        5. Quit
        
        Number of action to run: `));

        console.log(`User entered: ${command}`);

        if (command === 1) {
            console.log('Create customer');
            await createCustomer();
        } else if (command === 2) {
            console.log('View customers');
            await viewCustomers();
        } else if (command === 3) {
            console.log('Update a customer');
            await updateCustomer();
        } else if (command === 4) {
            console.log('Delete a customer');
            await deleteCustomer();
        } else if (command === 5) {
            console.log('Exiting...');
            break;
        } else {
            console.log('Invalid option. Please enter a valid number.');
        }
    }
};

connect();