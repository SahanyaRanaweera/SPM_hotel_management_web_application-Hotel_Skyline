import React, { Component } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";


const initialState = {
    customerServices: [],
    createdDate: '',
    total: '',
    id: ''


}

class updateServiceList extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onChange = this.onChange.bind(this);  //bind onChange function.
        this.onSubmit = this.onSubmit.bind(this);   //bind onSubmit function.
        this.deleteServiceList = this.deleteServiceList.bind(this);
        this.updateServiceList = this.updateServiceList.bind(this);


        this.backtoServiceListBillManagementDash = this.backtoServiceListBillManagementDash.bind(this);
    }

    componentDidMount() {
        const data = this.props.match.params.id;
        console.log("rrrr" + data);

        // var data1 = localStorage.getItem('serviceListID') || 1;

        axios.get(`http://localhost:8100/serviceList/${this.props.match.params.id}`)
            .then(response => {
                this.setState({ id: response.data.data._id })
                this.setState({ createdDate: response.data.data.createdDate });
                this.setState({ total: response.data.data.customerServices[0].cost });
                this.setState({ customerServices: response.data.data.customerServices });

                console.log("mtttmm", response.data.data.customerServices[0].cost);
            })
            .catch(error => {
                alert(error.message)
            })
    }

    updateServiceList(e, serviceListId) {
        window.location = `/update-CustomerService/${serviceListId}`
    }


    // updateIngredient(e, id) {
    //         localStorage.setItem('createdDate', this.state.createdDate);
    //         this.props.history.push({
    //             pathname: `/update-Ingredient/${id}`,
    //             data: `${orderNo}`
    //         })
    //     }


    backtoServiceListBillManagementDash(e) {
        window.location = '/create-serviceListBill'
    }

    onChange(e) {     //update states
        this.setState({ [e.target.name]: e.target.value })
    }

    // componentDidMount() {
    //     const ingredientOrder = this.props.match.params.id;
    //     console.log("pppp" + ingredientOrder);

    //     axios.get(`http://localhost:8100/ingredientOrder/${ingredientOrder}`)
    //         .then(response => {
    //             this.setState({ id: response.data.data._id })
    //             this.setState({ orderNumber: response.data.data.orderNumber })
    //             this.setState({ createdDate: response.data.data.createdDate })
    //             this.setState({ ingredients: response.data.data.ingredients })

    //             console.log("mmm" + response.data.data)
    //         })
    //         .catch(error => {
    //             alert(error.message)
    //         })
    // }

    deleteServiceList(e, serviceListId) {
        console.log("I am on Delete", serviceListId)
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
                axios.delete(`http://localhost:8100/serviceList/${serviceListId}`)

                Swal.fire(
                    'Deleted!',
                    'Service List has been deleted.',
                    'success'
                )
                window.location.reload(false);
            }
        })
    }

    

    onSubmit(e) {      //submit details
        e.preventDefault();     //avoid browser refresh. 
        let serviceList = {
            createdDate: this.state.createdDate,
            total: this.state.total,
            customerServices: this.state.customerServices,
        }
        console.log('DATA TO SEND', serviceList);

        axios.patch(`http://localhost:8100/serviceList/update/${this.state.id}`, serviceList)
            .then(response => {
                // alert('Food Data successfully updated')
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Updated service List details has been saved',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch(error => {
                console.log(error.message);
                alert(error.message)
            })

    }

    render() {
        //const { data } = this.props.location;
        console.log("aaaaaaqqq" + this.state.customerServices)
        //console.log("orderNo1: " + data);
        return (
            <div className="container-box"><br />

                <h2>Edit Customer Service Details</h2>
                <h5 htmlFor="content" className="form-label mb-4" style={{ textAlign: "left" }}>

                </h5>

                <form onSubmit={this.onSubmit} >

                    <div className={"row"}>
                        <div className={"col-md-6"}>


                            {/* <div className="mb-3" style={{ textAlign: "left" }}>
                                <label htmlFor="orderNumber" className="form-label">Ingredient Order Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="orderNumber"
                                    name="orderNumber"
                                    value={this.state.orderNumber}
                                    disabled
                                    onChange={this.onChange}
                                />
                            </div> */}

                            <div className="mb-3">
                                <label htmlFor="createdDate" className="form-label">Created Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="createdDate"
                                    name="createdDate"
                                    value={this.state.createdDate}
                                    disabled
                                    onChange={this.onChange}

                                />
                            </div>
                            <br />

                            {/* <button onClick={e => this.updateIngredient(e, this.state.orderNumber)} className="btn btn-primary">Add new Ingredient</button> */}

                            <br></br>

                            <h5><p><b>Customer Service List</b></p></h5>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Service Name</th>
                                            <th>Used Date</th>
                                            <th>No of Hours</th>
                                            <th>Price/Hours</th>
                                            <th>Cost</th>
                                            <th></th>
                                            <th></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.customerServices.length > 0 && this.state.customerServices.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.serviceName.name}</td>
                                                <td>{item.date}</td>
                                                <td>{item.noOfHours}</td>
                                                <td>{item.price}</td>
                                                <td>{item.cost}</td>
                                                
                                                <td><button type="button" className="btn btn-warning" onClick={e => this.updateServiceList(e, item._id)}>Update</button></td>
                                                <td><button type="button" className="btn btn-danger" onClick={e => this.deleteServiceList(e, item._id)}>Delete</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <br></br>
                            <div className="mb-3" style={{ textAlign: "left" }}>
                                <label htmlFor="total" className="form-label">Service Total</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="total"
                                    name="total"
                                    value={this.state.total}
                                    disabled
                                    onChange={this.onChange}
                                />
                            </div>

                            <br></br>
                            <br></br>
                            <button type="button" id="form-button" className="btn btn-secondary" onClick={e => this.backtoServiceListBillManagementDash(e)}>Back</button>
                            <button type="submit" id="form-button" className="btn btn-warning" >Update Customer Service </button>
                        </div>
                    </div>
                    <br>
                    </br>
                    <br></br>
                    <br></br>
                </form>


            </div>
        )
    }
}
export default updateServiceList;