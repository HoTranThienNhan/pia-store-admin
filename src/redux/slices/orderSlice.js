import { createSlice } from '@reduxjs/toolkit'

const initialState = [];

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        createOrderState: (state, action) => {
            const userId = action?.payload;
            // if user id exists (signed in)
            if (userId) {
                let isExistedOrderState = false;
                // check if user order state exists
                state.map((order) => {
                    if (order.user === userId) {
                        isExistedOrderState = true;
                    }
                })
                // if state or user order state was not created, create new order state
                if (state.length === 0 || isExistedOrderState === false) {
                    const initState = {
                        orderItems: [],
                        selectedOrderItems: [],
                        deliveryInformation: {
                            fullname: '',
                            phone: '',
                            address: '',
                            email: '',
                        },
                        paymentMethod: 'COD',
                        subtotalPrice: 0,
                        shippingPrice: 0,
                        totalPrice: 0,
                        user: userId,
                        isPaid: false,
                        paidAt: '',
                        isDelivered: false,
                        deliveredAt: '',
                    }
                    state.push(initState);
                }

            }
        },
        addOrderProduct: (state, action) => {
            // orderProductItems means order items which are about to be added to cart
            const { orderProductItems, userId } = action?.payload

            // check if user order state exists
            state.map((order) => {
                if (order.user === userId) {
                    // sameOrderItems means there are the same order items in cart 
                    // orderItems means order items in cart
                    const sameOrderItems = order?.orderItems?.find((item) => item?.product === orderProductItems?.product);

                    if (sameOrderItems) {
                        sameOrderItems.amount += orderProductItems.amount;
                    } else {
                        order?.orderItems?.push(orderProductItems);
                    }
                }
            })
        },
        setAmount: (state, action) => {
            const { productId, value, userId } = action?.payload;

            // check if user order state exists
            state.map((order) => {
                if (order.user === userId) {
                    // indicatedOrderItems contains the order items which are indicated in cart
                    // orderItems means order items in cart
                    const indicatedOrderItems = order?.orderItems?.find((item) => item?.product === productId);
                    indicatedOrderItems.amount = value;
                    // same with selected order items
                    const indicatedSelectedOrderItems = order?.selectedOrderItems?.find((item) => item?.product === productId);
                    if (indicatedSelectedOrderItems) {
                        indicatedSelectedOrderItems.amount = value;
                    }
                }
            })
        },
        increaseAmount: (state, action) => {
            const { productId, maxProductCount, userId } = action?.payload;

            // check if user order state exists
            state.map((order) => {
                if (order.user === userId) {
                    // indicatedOrderItems contains the order items which are indicated in cart
                    // orderItems means order items in cart
                    const indicatedOrderItems = order?.orderItems?.find((item) => item?.product === productId);
                    if (indicatedOrderItems?.amount < maxProductCount) {
                        indicatedOrderItems.amount++;
                    }
                    // same with selected order items
                    const indicatedSelectedOrderItems = order?.selectedOrderItems?.find((item) => item?.product === productId);
                    if (indicatedSelectedOrderItems?.amount < maxProductCount) {
                        indicatedSelectedOrderItems.amount++;
                    }
                }
            })
        },
        decreaseAmount: (state, action) => {
            const { productId, minProductCount, userId } = action?.payload;

            // check if user order state exists
            state.map((order) => {
                if (order.user === userId) {
                    // indicatedOrderItems contains the order items which are indicated in cart
                    // orderItems means order items in cart
                    const indicatedOrderItems = order?.orderItems?.find((item) => item?.product === productId);
                    if (indicatedOrderItems?.amount > minProductCount) {
                        indicatedOrderItems.amount--;
                    }
                    // same with selected order items
                    const indicatedSelectedOrderItems = order?.selectedOrderItems?.find((item) => item?.product === productId);
                    if (indicatedSelectedOrderItems?.amount > minProductCount) {
                        indicatedSelectedOrderItems.amount--;
                    }
                }
            })
        },
        removeOrderProduct: (state, action) => {
            const { productId, userId } = action?.payload;

            // check if user order state exists
            state.map((order) => {
                if (order.user === userId) {
                    // differentOrderItems contains the order items which are removed (filtering the others) 
                    // orderItems means order items in cart
                    const differentOrderItems = order?.orderItems?.filter((item) => item?.product !== productId);
                    order.orderItems = differentOrderItems;
                    // same with selected order items
                    const differentSelectedOrderItems = order?.selectedOrderItems?.filter((item) => item?.product !== productId);
                    order.selectedOrderItems = differentSelectedOrderItems;
                    // set shipping price and total price as default
                    order.shippingPrice = 0;
                    order.totalPrice = 0;
                }
            })
        },
        removeMultipleOrderProducts: (state, action) => {
            const { listCheckedProducts, userId } = action?.payload;

            // check if user order state exists
            state.map((order) => {
                if (order.user === userId) {
                    // orderItemsNotInList contains multiple order items in list (filtering the others)
                    // orderItems means order items in cart
                    const orderItemsInList = order?.orderItems?.filter((item) => !listCheckedProducts.includes(item?.product));
                    order.orderItems = orderItemsInList;
                    // same with selected order items
                    const selectedOrderItemsInList = order?.selectedOrderItems?.filter((item) => !listCheckedProducts.includes(item?.product));
                    order.selectedOrderItems = selectedOrderItemsInList;
                }
            })
        },
        selectedOrderProducts: (state, action) => {
            const { listCheckedProducts, userId } = action?.payload;
            const selectedOrderProducts = [];

            // check if user order state exists
            state.map((order) => {
                if (order.user === userId) {
                    order.orderItems?.forEach((item) => {
                        if (listCheckedProducts?.includes(item.product)) {
                            selectedOrderProducts.push(item);
                        }
                    });
                    order.selectedOrderItems = selectedOrderProducts;
                }
            })
        },
        setPaymentMethod: (state, action) => {
            const { paymentMethod, userId } = action?.payload;

            // check if user order state exists
            state.map((order) => {
                if (order.user === userId) {
                    order.paymentMethod = paymentMethod;
                }
            })
        },
        setDeliveryInformation: (state, action) => {
            const { buyerState, userId } = action?.payload;

            // check if user order state exists
            state.map((order) => {
                if (order.user === userId) {
                    order.deliveryInformation['fullname'] = buyerState?.fullname;
                    order.deliveryInformation['phone'] = buyerState?.phone;
                    order.deliveryInformation['address'] = buyerState?.address;
                    order.deliveryInformation['email'] = buyerState?.email;
                }
            })
        },
        setCosts: (state, action) => {
            const { subtotalMemo, totalMemo, deliveryFeeMemo, userId } = action?.payload;

            // check if user order state exists
            state.map((order) => {
                if (order.user === userId) {
                    order.totalPrice = totalMemo;
                    order.shippingPrice = deliveryFeeMemo;
                    order.subtotalPrice = subtotalMemo;
                }
            })
        },
        // resetOrder: (state) => {
        //     state.orderItems = [];
        //     state.selectedOrderItems = [];
        //     state.deliveryInformation = {
        //         fullname: '',
        //         phone: '',
        //         address: '',
        //     };
        //     state.paymentMethod = 'COD';
        //     state.subtotalPrice = 0;
        //     state.shippingPrice = 0;
        //     state.totalPrice = 0;
        //     state.user = '';
        //     state.isPaid = false;
        //     state.paidAt = '';
        //     state.isDelivered = false;
        //     state.deliveredAt = '';
        // },
        resetOrder: (state) => {
            state = [];
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    createOrderState,
    addOrderProduct,
    setAmount,
    increaseAmount,
    decreaseAmount,
    removeOrderProduct,
    removeMultipleOrderProducts,
    selectedOrderProducts,
    setPaymentMethod,
    setDeliveryInformation,
    setCosts,
    resetOrder,
} = orderSlice.actions

export default orderSlice.reducer