
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

const FloatingCartButton = () => {
    const { itemCount } = useCart();

    if (itemCount === 0) {
        return null;
    }

    return (
        <Button
            asChild
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 flex items-center justify-center"
            size="icon"
        >
            <Link to="/cart">
                <ShoppingCart className="h-8 w-8" />
                <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                    {itemCount}
                </span>
                <span className="sr-only">View Cart</span>
            </Link>
        </Button>
    );
};

export default FloatingCartButton;
