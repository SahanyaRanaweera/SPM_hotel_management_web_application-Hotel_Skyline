const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');       //environmental variables
const cors = require('cors');           //middleware
const bodyParser = require('body-parser');
const request = require('supertest');

//import APIs
const attendanceAPI = require('../apis/attendance.api');//IT19059150 - Ranaweera I.G.S.V
const employeeLeaveAPI = require('../apis/employeeLeaves.api');//IT19059150
const foodApi = require('../apis/food.api');// IT19021058 -De Seram E.M.A.P.
const ingredientApi = require('../apis/ingredient.api'); // IT19021058 -De Seram E.M.A.P.
const serviceListApi = require('../apis/serviceList.api'); // IT19021058 -De Seram E.M.A.P.
const customerServiceApi = require('../apis/customerService.api'); // IT19021058 -De Seram E.M.A.P.
const roomAPI = require('../apis/room.api'); //IT19007502 - Hiddalarachchi J.
const serviceAPI = require('../apis/service.api');  //IT19007502 - Hiddalarachchi J.
const employeeAPI = require('../apis/employee.api');    //IT19007502 - Hiddalarachchi J.
const bookingAPI = require('../apis/booking.api'); //IT19051826

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
jest.setTimeout(18000);

//port no for run backend server
const PORT = process.env.TESTPORT || 8067;
const MONGODB_URI = process.env.TESTMONGODB_URI;

//connect to database
mongoose.connect(MONGODB_URI || '&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (error) => {
    if (error) {
        console.log('Database Error: ', error.message);
    }
});

//open connection
mongoose.connection.once('open', () => {
    console.log('Database Synced');
});

//root route
app.route('/').get((req, res) => {
    res.send('SLIIT SPM Project Test');
});

app.listen(PORT, () => {
    console.log(`Server is up and running on PORT ${PORT}`);
});

//register router - CHANGEABLE.
//IT19007502 - Hiddalarachchi J.
app.use('/room', roomAPI());    //IT19007502 - Hiddalarachchi J.
app.use('/employee', employeeAPI());    //IT19007502 - Hiddalarachchi J.
app.use('/service', serviceAPI());  //IT19007502 - Hiddalarachchi J.
app.use('/booking', bookingAPI()); //IT19051826 - Herath D.D.M
app.use('/food', foodApi());// IT19021058 -De Seram E.M.A.P.
app.use('/serviceList', serviceListApi());  // IT19021058 -De Seram E.M.A.P.
app.use('/ingredient', ingredientApi()); // IT19021058 -De Seram E.M.A.P.
app.use('/customerService', customerServiceApi());  // IT19021058 -De Seram E.M.A.P.
app.use('/attendance', attendanceAPI());
app.use('/employeeLeaves', employeeLeaveAPI());

//TestCases
//test case 01 - add new room
test('Backend Test Case 01 - Should insert a new room - IT19007502 - Hiddalarachchi J.', async () => {
    await request(app).post('/room/create').send({
        roomNo:"Z002",
        category:"Single Room",
        airConditioningCategory:"A/C",
        description: "High Budget Room",
        price:18000,
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 02 - Update room details
test('Backend Test Case 02 - Should update existing room details - IT19007502  - Hiddalarachchi J.', async () => {
    await request(app).patch('/room/update/61542fffd452935a383b6918').send({
        roomNo:"Z055",
        category:"Double Room",
        airConditioningCategory:"Non A/C",
        description: "Budget Room",
        price:18070,
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 03 - delete room details
test('Backend Test Case 03 - Should delete existing room details - IT19007502  - Hiddalarachchi J.', async () => {
    await request(app).delete('/room/6154a770877e0b25dcbe7983').send({
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 04 - get specific room details
test('Backend Test Case 04 - Should get specific room details - IT19007502  - Hiddalarachchi J.', async () => {
    await request(app).get('/room/6154d07f651ba2408436d4c4').send({
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 05 - add new working employee
test('Backend Test Case 05 - Should insert a new working employee - IT19007502  - Hiddalarachchi J.', async () => {
    await request(app).post('/employee/create').send({
        name:"Saman Hettiwaththa",
        position:"Chef",
        email:"saman@skylight.com",
        mobileNumber: "0787555555",
        nicNo:"544481111V",
        salary:75000,
        isWorking: true,
        userName:"samanH",
        password:"saman123"
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 06 - add retired working employee
test('Backend Test Case 06 - Should insert retired employee - IT19007502  - Hiddalarachchi J.', async () => {
    await request(app).post('/employee/create').send({
        name:"Saman Hettiwaththa",
        position:"Chef",
        email:"saman@skylight.com",
        mobileNumber: "0787555555",
        nicNo:"544481111V",
        salary:75000,
        isWorking: false,
        userName:"samanH",
        password:"saman123"
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 07 - Update working employee details
test('Backend Test Case 07 - Should update existing working employee details - IT19007502  - Hiddalarachchi J.', async () => {
    await request(app).patch('/employee/update/615434cf0214155e44096f9b').send({
        name:"Saman1 Hettiwaththa",
        position:"Manager",
        email:"saman1@skylight.com",
        mobileNumber: "0787555511",
        nicNo:"544481177V",
        salary:75007,
        isWorking: true,
        userName:"samanH1",
        password:"saman123777",
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 08 - delete retired employee details
test('Backend Test Case 08 - Should delete retired employee details - IT19007502  - Hiddalarachchi J.', async () => {
    await request(app).delete('/employee/6154d080651ba2408436d4cb').send({
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 09 - get specific employee details
test('Backend Test Case 09 - Should get specific employee details - IT19007502  - Hiddalarachchi J.', async () => {
    await request(app).get('/employee/6154a886f7a94763d446f408').send({
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 10 - add new service
test('Backend Test Case 10 - Should insert a new service - IT19007502  - Hiddalarachchi J.', async () => {
    await request(app).post('/service/create').send({
        serviceNo:"SN085",
        name:"Surfing",
        addedDate:"2011-11-11",
        pricePerHour: "5500",
        description: "We pay attention for build your joy with nature",
        employeeCount:15,
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 11 - Update service details
test('Backend Test Case 11 - Should update existing service details - IT19007502  - Hiddalarachchi J.', async () => {
    await request(app).patch('/service/update/61543506c6bf3a0a948f2dc4').send({
        serviceNo:"SN885",
        name:"Sea Surfing",
        addedDate:"2022-12-10",
        pricePerHour: "5500",
        description: "We pay attention for build your joy with sea creations",
        employeeCount:25,
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 12 - delete service details
test('Backend Test Case 12 - Should delete existing service details - IT19007502  - Hiddalarachchi J.', async () => {
    await request(app).delete('/service/6154d080651ba2408436d4c7').send({
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 13 - get specific service details
test('Backend Test Case 13 - Should get specific service details - IT19007502  - Hiddalarachchi J.', async () => {
    await request(app).get('/service/6154a7b00afbc94b78ac4e14').send({
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//IT19051826 Test Case 14
//test case 14 - get all booking details
test('Backend Test Case 14 - Should get all booking details - IT19051826  - Herath D.D.M.', async () => {
    await request(app).get('/booking/').send({  
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//IT19051826 Test Case 15
//test case 15 - create booking 
test('Backend Test Case 15 - Should create booking - IT19051826  - Herath D.D.M.', async () => {
    await request(app).post('/booking/create').send({  
        bookingNo:"B009",
        customerId:"222244V",
        roomNo:"D001",
        boardingType:"fullboard",
        bookingDate:"2021-08-24T18:30:00.000+00:00",
        noOfGuests:4,
        days:2,
        arrivalDate:"2021-08-26T18:30:00.000+00:00",
        remarks:"Play area",
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//IT19051826 Test Case 16
//test case 16 - delete selected booking details 
test('Backend Test Case 16 - delete booking details - IT19051826  - Herath D.D.M.', async () => {
    await request(app).delete('/booking/61471b41e8f6c32080be4e78').send({  
   
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//IT19051826 Test Case 17
//test case 17 - Update selected booking details 
test('Backend Test Case 17 - should update selected booking details - IT19051826  - Herath D.D.M.', async () => {
    await request(app).patch('/booking/update/6123ec1ca2b1e110bc563b67').send({  
        bookingNo:"B009",
        customerId:"22224475V",
        roomNo:"D001",
        boardingType:"fullboard",
        bookingDate:"2021-08-24T18:30:00.000+00:00",
        noOfGuests:4,
        days:2,
        arrivalDate:"2021-08-26T18:30:00.000+00:00",
        remarks:"Play area",
    }).expect(200).then((res) => {
      
    });
})

//test case 18 - add new food
test('Backend Test Case 18 - should insert a new Food - IT19021058  - De Seram E.M.A.P.', async () => {
    await request(app).post('/food/create').send({
        foodNumber: "N00648",
        foodName: "Rice",
        category: "Dinner",
        price: 500,
        description: "Fried Rice",
        createDate: "2021-08-10",
        status: "True",
        chefName: "416d616c6920706572657261",
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 19 - update food details
test('Backend Test Case 19 - should update Food - IT19021058  - De Seram E.M.A.P.', async () => {
    await request(app).patch('/food/update/6154b935a96a0b141c85bf68').send({
        foodNumber: "N00648",
        foodName: "Rice",
        category: "Dinner",
        price: 800,
        description: "Fried Rice",
        createDate: "2021-08-10",
        status: "True",
        chefName: "416d616c6920706572657261",
    }).expect(200).then((res) => {

    });
})

//test case 20 - delete selected ingredient
test('Backend Test Case 20 - should delete ingredient - IT19021058  - De Seram E.M.A.P.', async () => {
    await request(app).delete('/ingredient/61249bda7512594d4c3c5c4a').send({

    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 21 - create new ingredient
test('Backend Test Case 21 - should insert a new Ingredient - IT19021058  - De Seram E.M.A.P.', async () => {
    await request(app).post('/ingredient/create').send({
        orderNumber: "IO00082",
        ingredientName: "Carrot",
        quantity: "15kg",
        chefName: "611a0f6ca28bea02808efe8a",
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 22 - get all service list details
test('Backend Test Case 22 - should get service list details - IT19021058  - De Seram E.M.A.P.', async () => {
    await request(app).get('/serviceList').send({

    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 23 - add new customer service
test('Backend Test Case 23 - should insert a new Customer service - IT19021058  - De Seram E.M.A.P.', async () => {
    await request(app).post('/customerService/create').send({
        bookingID: "61267e14d326d6217cc60b11",
        serviceName: "6124244653d5e665c865323e",
        date: "2021-09-28",
        noOfHours: 2,
        price: 750,
        cost: 1500,
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})

//test case 24 IT19059150
test('Backend Test Case 24 - Should enter a new attendance - IT19059150  - Ranaweera I.G.S.V.', async () => {
    await request(app).post('/attendance/create').send({
        "employee": "61202cba45591f2f9421f5c7",
        "receptionist": "611f2fecea3a3a3cc4f2cab2",
        "status": "Working"
    }).expect(200).then((res) => {
      
    });
})

//test case 25 IT19059150
test('Backend Test Case 25 - Should get all employee Leaves details - IT19059150  - Ranaweera I.G.S.V.', async () => {
    await request(app).get('/employeeLeaves/').send({  
    }).expect(200).then((res) => {
        id = res.body._id;
    });
})