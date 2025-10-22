-- Добавление тестовых категорий
INSERT INTO categories (name, slug, parent_id, image_url) VALUES
('Процессоры', 'processors', NULL, 'https://via.placeholder.com/300x200?text=CPU'),
('Материнские платы', 'motherboards', NULL, 'https://via.placeholder.com/300x200?text=Motherboards'),
('Видеокарты', 'graphics-cards', NULL, 'https://via.placeholder.com/300x200?text=GPU'),
('Оперативная память', 'ram', NULL, 'https://via.placeholder.com/300x200?text=RAM'),
('SSD накопители', 'ssd', NULL, 'https://via.placeholder.com/300x200?text=SSD'),
('Блоки питания', 'power-supply', NULL, 'https://via.placeholder.com/300x200?text=PSU'),
('Корпуса', 'cases', NULL, 'https://via.placeholder.com/300x200?text=Cases'),
('Охлаждение', 'cooling', NULL, 'https://via.placeholder.com/300x200?text=Cooling');

-- Добавление тестовых брендов
INSERT INTO brands (name, slug, logo_url, description) VALUES
('Intel', 'intel', 'https://via.placeholder.com/150x50?text=Intel', 'Американский производитель процессоров'),
('AMD', 'amd', 'https://via.placeholder.com/150x50?text=AMD', 'Производитель процессоров и видеокарт'),
('NVIDIA', 'nvidia', 'https://via.placeholder.com/150x50?text=NVIDIA', 'Лидер в производстве видеокарт'),
('ASUS', 'asus', 'https://via.placeholder.com/150x50?text=ASUS', 'Производитель материнских плат и комплектующих'),
('MSI', 'msi', 'https://via.placeholder.com/150x50?text=MSI', 'Производитель игровых комплектующих'),
('Corsair', 'corsair', 'https://via.placeholder.com/150x50?text=Corsair', 'Производитель памяти и периферии'),
('Kingston', 'kingston', 'https://via.placeholder.com/150x50?text=Kingston', 'Производитель памяти и накопителей'),
('Samsung', 'samsung', 'https://via.placeholder.com/150x50?text=Samsung', 'Производитель SSD и электроники'),
('Gigabyte', 'gigabyte', 'https://via.placeholder.com/150x50?text=Gigabyte', 'Производитель материнских плат'),
('Cooler Master', 'cooler-master', 'https://via.placeholder.com/150x50?text=CoolerMaster', 'Производитель систем охлаждения');

-- Добавление тестовых товаров
INSERT INTO products (category_id, brand_id, name, slug, description, price, old_price, stock_quantity, image_url, is_featured, rating, reviews_count) VALUES
(1, 1, 'Intel Core i9-13900K', 'intel-i9-13900k', 'Флагманский процессор Intel 13-го поколения с 24 ядрами', 54990.00, 59990.00, 15, 'https://via.placeholder.com/400x400?text=i9-13900K', true, 4.8, 127),
(1, 2, 'AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', 'Топовый процессор AMD с 16 ядрами', 49990.00, NULL, 20, 'https://via.placeholder.com/400x400?text=Ryzen-9-7950X', true, 4.9, 203),
(1, 1, 'Intel Core i5-13600K', 'intel-i5-13600k', 'Игровой процессор среднего уровня с 14 ядрами', 27990.00, NULL, 30, 'https://via.placeholder.com/400x400?text=i5-13600K', false, 4.7, 89),
(3, 3, 'NVIDIA RTX 4090', 'nvidia-rtx-4090', 'Самая мощная видеокарта для игр и профессиональных задач', 149990.00, 159990.00, 5, 'https://via.placeholder.com/400x400?text=RTX-4090', true, 5.0, 312),
(3, 3, 'NVIDIA RTX 4070 Ti', 'nvidia-rtx-4070-ti', 'Производительная видеокарта для игр в 4K', 79990.00, NULL, 12, 'https://via.placeholder.com/400x400?text=RTX-4070-Ti', true, 4.6, 156),
(3, 2, 'AMD Radeon RX 7900 XTX', 'amd-rx-7900-xtx', 'Флагманская видеокарта AMD', 89990.00, 94990.00, 8, 'https://via.placeholder.com/400x400?text=RX-7900-XTX', false, 4.5, 98),
(2, 4, 'ASUS ROG MAXIMUS Z790', 'asus-rog-maximus-z790', 'Топовая материнская плата для Intel', 39990.00, NULL, 10, 'https://via.placeholder.com/400x400?text=ROG-Z790', true, 4.8, 67),
(2, 5, 'MSI MPG B650 GAMING', 'msi-mpg-b650', 'Игровая материнская плата для AMD', 19990.00, 21990.00, 18, 'https://via.placeholder.com/400x400?text=MSI-B650', false, 4.4, 45),
(4, 6, 'Corsair Vengeance DDR5 32GB', 'corsair-vengeance-ddr5-32gb', 'Комплект оперативной памяти 32GB (2x16GB) DDR5-6000', 14990.00, NULL, 25, 'https://via.placeholder.com/400x400?text=Corsair-DDR5', false, 4.7, 134),
(4, 7, 'Kingston FURY Beast DDR4 16GB', 'kingston-fury-ddr4-16gb', 'Комплект памяти 16GB (2x8GB) DDR4-3200', 5990.00, 6990.00, 40, 'https://via.placeholder.com/400x400?text=Kingston-DDR4', false, 4.5, 201),
(5, 8, 'Samsung 980 PRO 2TB', 'samsung-980-pro-2tb', 'Скоростной NVMe SSD накопитель 2TB', 17990.00, NULL, 22, 'https://via.placeholder.com/400x400?text=Samsung-980-PRO', true, 4.9, 289),
(5, 7, 'Kingston KC3000 1TB', 'kingston-kc3000-1tb', 'NVMe SSD накопитель 1TB', 8990.00, 9990.00, 35, 'https://via.placeholder.com/400x400?text=Kingston-KC3000', false, 4.6, 112),
(6, 6, 'Corsair RM1000x', 'corsair-rm1000x', 'Модульный блок питания 1000W 80+ Gold', 14990.00, NULL, 15, 'https://via.placeholder.com/400x400?text=Corsair-RM1000x', false, 4.8, 87),
(7, 10, 'Cooler Master MasterCase H500', 'cooler-master-h500', 'Корпус среднего размера с отличным охлаждением', 11990.00, 12990.00, 12, 'https://via.placeholder.com/400x400?text=CM-H500', false, 4.5, 56),
(8, 10, 'Cooler Master Hyper 212', 'cooler-master-hyper-212', 'Башенный кулер для процессора', 2990.00, NULL, 50, 'https://via.placeholder.com/400x400?text=Hyper-212', false, 4.6, 342);

-- Добавление характеристик для товаров
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(1, 'Количество ядер', '24 (8P+16E)'),
(1, 'Частота', '3.0 - 5.8 ГГц'),
(1, 'Сокет', 'LGA 1700'),
(1, 'TDP', '125 Вт'),
(2, 'Количество ядер', '16'),
(2, 'Частота', '4.5 - 5.7 ГГц'),
(2, 'Сокет', 'AM5'),
(2, 'TDP', '170 Вт'),
(4, 'Память', '24 GB GDDR6X'),
(4, 'Частота GPU', '2520 МГц'),
(4, 'Разъемы', '3x DisplayPort, 1x HDMI'),
(4, 'TDP', '450 Вт'),
(11, 'Объем', '2000 GB'),
(11, 'Интерфейс', 'NVMe PCIe 4.0'),
(11, 'Скорость чтения', '7000 МБ/с'),
(11, 'Скорость записи', '5100 МБ/с');

-- Добавление администратора
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('admin@mixpc.ru', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Администратор', '+79991234567', 'admin');
