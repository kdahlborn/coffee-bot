import menu from '../data/menu';

export const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
        const product = menu.find((p) => p.title === item.name);

        if (!product) return total;

        return total + product.price * item.quantity;
    }, 0);
};
