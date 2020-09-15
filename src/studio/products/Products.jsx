import React from 'react';
import { Card } from 'react-bootstrap';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import { dashBoardService } from "../services/AdminDashboardService";

import { BasicSpinner } from "../utils/BasicSpinner";
import StudioTable from '../utils/StudioTable';

class Product extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            products: {
                data: {},
                loading: true,
                error: false
            },
        }
    }

    componentDidMount() {
        dashBoardService.getData('products?limit=50')
            .then(response => {
                response.data.records.forEach(function (productInfo) {
                    productInfo.titleGroup = {
                        name: productInfo.name,
                        image: `https://demo.digitaldots.io/api/image?imageId=${productInfo.id}`
                    };
                    productInfo.category_name = productInfo.categ_id[1]
                })
                this.setState({
                    products: {
                        data: response.data,
                        loading: false,
                        error: false
                    }
                })
            })
            .catch(error => {
                this.setState({
                    products: {
                        data: {},
                        loading: false,
                        error: true
                    }
                })
                console.log("ERROR", error)
            })
    }

    render() {
        const { products } = this.state;
        const productsHeader = [
            { label: 'Title', key: 'titleGroup' },
            { label: 'Code', key: 'default_code' },
            { label: 'Quantity', key: 'qty_available' },
            { label: 'Price', key: 'list_price' },
            { label: 'Category', key: 'category_name' },
            { label: 'Forecast', key: 'virtual_available' },
            { label: 'Variant Count', key: 'product_variant_count' }
        ];

        return (
            <section className="studio-container">
                {products.loading &&
                    <Card>
                        <Card.Body>
                            <BasicSpinner />
                        </Card.Body>
                    </Card>
                }
                {!products.loading &&
                    <StudioTable tableName={'Products'}
                        tableHeader={productsHeader}
                        tableData={products.data.records}
                    />
                }
            </section >
        )
    }
}

const mapStateToProps = state => {
    return {
        CartItems: state.CartItems
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addItem: (item) => dispatch({ type: actionTypes.ADD_ITEM, item: item }),
        clearCart: () => dispatch({ type: actionTypes.CLEAR_CART }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);