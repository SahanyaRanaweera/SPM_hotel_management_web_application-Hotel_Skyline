import Swal from "sweetalert2";
import React, { Component } from 'react';
import axios from 'axios';
import './roomBookingManagement.css';
import jsPDF from "jspdf";
import "jspdf-autotable";

class kitchentransferredOrderManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderId: '',
            id: '',
            kitchenorders: [],
            foodorders: [],
            searchValue: '',
        }

        this.deleteKitchenOrder = this.deleteKitchenOrder.bind(this);
        this.onChange = this.onChange.bind(this);



    }

    componentDidMount() {


        axios.get('http://localhost:8100/kitchenorder/')
            .then(response => {
                this.setState({ kitchenorders: response.data.data });

            })

    }


    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });

    }


    deleteKitchenOrder(e, kitchenorderId) {
        console.log("Delete", kitchenorderId)
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8100/kitchenorder/${kitchenorderId}`)
                Swal.fire(
                    'Deleted!',
                    'Kitchen Transferred Order Removed.',
                    'success'
                )
            }
            window.location.reload(false);
        })
    }


    searchHandler = (event) => {



        let searchResults = this.state.kitchenorders;
        searchResults = searchResults.filter(result => {
            return result.orderId.toLowerCase().search(
                event.target.value.toLowerCase()) !== -1;

        });

        this.setState({
            kitchenorders: searchResults,
            //room: searchResults,
            searchValue: event.target.value.toLowerCase()

        }, () => console.log('state', this.state))


    };


    exportFoodOrderingPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Food Orderings";
        const headers = [["OrderId", "foodName", "price", "quantity", "price*Qty", "Total"]];


        const data = this.state.kitchenorders.map(item =>

            [
                item.orderId,

                item.foodorders.map(item => [
                    item.foodName,
                ]), item.foodorders.map(item => [
                    item.price,
                ]), item.foodorders.map(item => [
                    item.quantity,
                ]), item.foodorders.map(item => [
                    item.pricenquantity,
                ]),
                item.totalPrice,


            ]);



        let content = {
            startY: 50,
            head: headers,
            body: data
        };


        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.previousAutoTable.finalY + 25;
        var today = new Date();
        var newdate = "Date Printed :" + today;
        doc.text(marginLeft,
            marginTop, newdate);
        doc.save("report2.pdf")
    }


    render() {
        return (
            <div>
                <br /><br />
                <div className="row justify-content-center" id="dash-box">
                    <div className="container-dash">
                        <h2><b>Receptionist Dashboard</b></h2>
                        <div className="row justify-content-evenly">
                            <div className="col-3 align-self-stretch">

                                <div className="row">
                                    <div className="container" >
                                        <h3 className="h3"><b>Creations</b></h3>
                                        <div className="list-group">
                                            <a href="/checkAvailableRooms" className="routeBtn"><button type="button" className="list-group-item list-group-item-action">Check Available Rooms</button></a>
                                            <a href="/roomBookingManagement" className="routeBtn"><button type="button" className="list-group-item list-group-item-action " >
                                                Room Booking Management
                                            </button></a>
                                            <button type="button" className="list-group-item list-group-item-action">Employee Leaves</button>
                                            <button type="button" className="list-group-item list-group-item-action">Employee Attendance</button>
                                            <a href="/foodorder" className="routeBtn"><button type="button" className="list-group-item list-group-item-action " >Food Ordering</button></a>
                                            <a href="/kitchentransferredOrderManagement" className="routeBtn"><button type="button" id="active-button" className="list-group-item list-group-item-action active" aria-current="true">Kitchen Transferred Orders</button></a>
                                            <a href="/create-serviceListBill" className="routeBtn"><button type="button" className="list-group-item list-group-item-action">Service List Bill</button></a>
                                            <a href="/reception/checkout" className="routeBtn"><button type="button" className="list-group-item list-group-item-action ">Checkout Handling</button></a>
                                        </div>
                                    </div>
                                </div>
                                <br /><br /><br /><br />
                            </div>
                            <div className="col-8 align-self-stretch">
                                <div className="container" >


                                    <div className="float-end">
                                        <form className="d-flex">
                                            <input
                                                className="form-control me-2"
                                                type="search"
                                                placeholder="Enter orderId"
                                                aria-label="Search"
                                                name="orderId"
                                                value={this.state.searchValue}
                                                onChange={this.searchHandler}
                                            />
                                            <button className="btn btn-primary" type="submit">Search</button>
                                        </form>
                                    </div>
                                    <div className="col-4">
                                        <h3 className="h3"><b>Kitchen Transferred Orders</b></h3>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>OrderID</th>
                                                    <th>FoodName</th>
                                                    <th>Price (Rs.)</th>
                                                    <th>Quantity</th>
                                                    <th>Price*Qty</th>
                                                    <th>Order Total</th>
                                                    <th></th>
                                                    <th></th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.kitchenorders.length > 0 && this.state.kitchenorders.map((item, index) => (
                                                    <tr key={index}>
                                                        <td><h5>{item.orderId}</h5></td>
                                                        <td>
                                                            {item.foodorders.map((item, index) => (
                                                                <h5> {item.foodName}</h5>

                                                            ))}

                                                        </td>
                                                        <td>

                                                            {item.foodorders.map((item, index) => (
                                                                <h5> {item.price}</h5>

                                                            ))}
                                                        </td>
                                                        <td>

                                                            {item.foodorders.map((item, index) => (
                                                                <h5> {item.quantity}</h5>

                                                            ))}
                                                        </td>

                                                        <td>
                                                            {item.foodorders.map((item, index) => (
                                                                <h5> {item.pricenquantity}</h5>

                                                            ))}
                                                        </td>
                                                        <td><h5>{item.totalPrice}</h5></td>
                                                        <td><button type="button" className="btn btn-danger" onClick={e => this.deleteKitchenOrder(e, item._id)}>Delete</button></td>


                                                    </tr>
                                                ))}
                                            </tbody>


                                        </table>

                                        <br></br>
                                        <div className="generateReportbtn">
                                            <button type="button" className="btn btn-dark" onClick={() => this.exportFoodOrderingPDF()}>Generate Report</button>
                                        </div>



                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <br /><br />
            </div>
        )
    }
}

export default kitchentransferredOrderManagement;