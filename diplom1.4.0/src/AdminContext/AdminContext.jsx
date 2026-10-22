import { createContext, useContext, useEffect, useState } from 'react';

const AdminContext = createContext(null);

const PRODUCTS_API_URL = '/api/products';
const ORDERS_API_URL = '/api/orders';

export const AdminProvider = ({ children }) => {
    const [adminItems, setAdminItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Получить товары
    const loadAdminItems = async () => {
        try {
            setLoading(true);

            const response = await fetch(PRODUCTS_API_URL);

            if (!response.ok) {
                throw new Error('Ошибка загрузки товаров');
            }

            setAdminItems(await response.json());
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        } finally {
            setLoading(false);
        }
    };

    // Получить заказы
    const loadOrders = async () => {
        try {
            const response = await fetch(ORDERS_API_URL);

            if (!response.ok) {
                throw new Error('Ошибка загрузки заказов');
            }

            setOrders(await response.json());
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
        }
    };

    useEffect(() => {
        loadAdminItems();
        loadOrders();
    }, []);

    // Добавить товар в каталог
    const addAdminItem = async (item) => {
        try {
            const product = {
                id: Number(item.id),
                title: item.title,
                type: item.type,
                price: Number(item.price),
                poster: item.poster,
                rating:
                    item.rating !== undefined
                        ? Number(item.rating)
                        : undefined
            };

            const response = await fetch(PRODUCTS_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Ошибка добавления товара'
                );
            }

            setAdminItems((currentItems) => [...currentItems, data]);

            return data;
        } catch (error) {
            console.error('Ошибка добавления товара:', error);
            throw error;
        }
    };

    // Изменить товар в каталоге
    const updateAdminItem = async (updatedItem) => {
        try {
            const product = {
                title: updatedItem.title,
                type: updatedItem.type,
                price: Number(updatedItem.price),
                poster: updatedItem.poster,
                rating:
                    updatedItem.rating !== undefined
                        ? Number(updatedItem.rating)
                        : undefined
            };

            const response = await fetch(
                `${PRODUCTS_API_URL}/${updatedItem.type}/${updatedItem.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Ошибка изменения товара'
                );
            }

            setAdminItems((currentItems) =>
                currentItems.map((item) =>
                    item.type === data.type && item.id === data.id
                        ? data
                        : item
                )
            );

            return data;
        } catch (error) {
            console.error('Ошибка изменения товара:', error);
            throw error;
        }
    };

    // Удалить товар из каталога
    const removeAdminItem = async (type, id) => {
        try {
            const response = await fetch(
                `${PRODUCTS_API_URL}/${type}/${id}`,
                { method: 'DELETE' }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Ошибка удаления товара'
                );
            }

            setAdminItems((currentItems) =>
                currentItems.filter(
                    (item) =>
                        !(item.type === type && item.id === Number(id))
                )
            );

            return data;
        } catch (error) {
            console.error('Ошибка удаления товара:', error);
            throw error;
        }
    };

    // Изменить заказ
    // PUT /api/orders/:id
    const updateOrder = async (orderId, updatedData) => {
        try {
            const response = await fetch(
                `${ORDERS_API_URL}/${orderId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        items: updatedData.items
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Ошибка изменения заказа'
                );
            }

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order._id === orderId ? data : order
                )
            );

            return data;
        } catch (error) {
            console.error('Ошибка изменения заказа:', error);
            throw error;
        }
    };

    // Удалить один товар из заказа
    const removeOrderItem = async (orderId, itemIndex) => {
        try {
            const response = await fetch(
                `${ORDERS_API_URL}/${orderId}/items/${itemIndex}`,
                { method: 'DELETE' }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        'Не удалось удалить товар из заказа'
                );
            }

            if (data.deletedOrder) {
                setOrders((currentOrders) =>
                    currentOrders.filter(
                        (order) => order._id !== orderId
                    )
                );
            } else {
                setOrders((currentOrders) =>
                    currentOrders.map((order) =>
                        order._id === orderId ? data.order : order
                    )
                );
            }

            return data;
        } catch (error) {
            console.error('Ошибка удаления товара из заказа:', error);
            throw error;
        }
    };

    return (
        <AdminContext.Provider
            value={{
                adminItems,
                loading,
                loadAdminItems,
                addAdminItem,
                updateAdminItem,
                removeAdminItem,

                orders,
                loadOrders,
                updateOrder,
                removeOrderItem
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);

    if (!context) {
        throw new Error(
            'useAdmin должен использоваться внутри AdminProvider'
        );
    }

    return context;
};