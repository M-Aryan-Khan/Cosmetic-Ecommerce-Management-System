CREATE OR REPLACE FUNCTION update_stock_on_order_status() RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
BEGIN
    IF NEW.order_status = 'Completed' AND OLD.order_status != 'Completed' THEN
        FOR item IN SELECT product_id, quantity FROM order_item WHERE order_id = NEW.order_id LOOP
            UPDATE product
            SET stock_level = stock_level - item.quantity
            WHERE product_id = item.product_id;
        END LOOP;
    ELSIF NEW.order_status = 'Cancelled' AND OLD.order_status = 'Completed' THEN
        FOR item IN SELECT product_id, quantity FROM order_item WHERE order_id = NEW.order_id LOOP
            UPDATE product
            SET stock_level = stock_level + item.quantity
            WHERE product_id = item.product_id;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_after_order_status_change
AFTER UPDATE OF order_status ON "order"
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_order_status();

