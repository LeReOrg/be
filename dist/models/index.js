"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var categories = [{
  id: '1',
  name: 'Giày dép',
  image_url: 'https://p0.pikist.com/photos/276/90/shoes-tourism-dirt-camping-motion-travel-thumbnail.jpg'
}, {
  id: '2',
  name: 'Ba lô',
  image_url: 'https://d2a2wjuuf1c30f.cloudfront.net/product_photos/65380347/file_c54337fa3f_original.jpg'
}, {
  id: '3',
  name: 'Lều trại',
  image_url: 'https://i.pinimg.com/originals/a3/1a/2b/a31a2bf1349dabd6d35bf3dc01ec247d.png'
}, {
  id: '4',
  name: 'Đồ điện tử',
  image_url: 'https://www.beachcamera.com/shop/product-image.aspx?size=500&picId=513380'
}, {
  id: '5',
  name: 'Xe máy',
  image_url: 'https://motorvina.com/wp-content/uploads/2016/10/honda-win-rent-sell-buy-hue-da-nang-hoi-an-motorvina-hanoi-motorbike-rental-hue-motorbike-rental-da-nang-motorbike-rental-ho-chi-minh-motorbike-rentalsemi-bike-rental-honda-win-.jpg'
}, {
  id: '6',
  name: 'Dụng cụ nấu ăn',
  image_url: 'https://thegioidogiadung.com.vn/20473-large_default/b-dng-c-nau-an-6-mon-wmf.jpg'
}, {
  id: '7',
  name: 'Dụng cụ đa năng',
  image_url: 'https://cdn.boba.vn/static/san-pham/nha-cua/thiet-bi-va-dung-cu-sua-chua/thiet-bi-dung-cu-sua-chua-khac/bo-dung-cu-da-nang-jeep-9-in1/dung-cu-jeep-11.png'
}, {
  id: '8',
  name: 'Các loại khác',
  image_url: 'https://s.meta.com.vn/Data/image/2020/06/15/bao-cao-su-durex-fetherlite-ultima-hop-12-chiec.jpg'
}];
var products = [{
  id: '1',
  category_id: '1',
  owner_id: '1',
  name: 'Đôi giày',
  image_url: 'https://p0.pikist.com/photos/276/90/shoes-tourism-dirt-camping-motion-travel-thumbnail.jpg',
  thumbnails: ['https://www.rei.com/media/5bbcbee2-1b95-4b9a-9347-065a3937152c?size=784x588', 'https://s7d4.scene7.com/is/image/WolverineWorldWide/MRLM-J06039-071816-S17-HERO?wid=3000&hei=2475&fmt=jpeg&qlt=80,0&op_sharpen=0&resMode=bilin&op_usm=0.5,1.0,8,0&iccEmbed=0&printRes=72', 'https://s7d4.scene7.com/is/image/WolverineWorldWide/MRLM-J06039-071816-S17-060?wid=3000&hei=2475&fmt=jpeg&qlt=80,0&op_sharpen=0&resMode=bilin&op_usm=0.5,1.0,8,0&iccEmbed=0&printRes=72', 'https://s7d4.scene7.com/is/image/WolverineWorldWide/MRLM-J06039-071816-S17-OUT?wid=3000&hei=2475&fmt=jpeg&qlt=80,0&op_sharpen=0&resMode=bilin&op_usm=0.5,1.0,8,0&iccEmbed=0&printRes=72', 'https://s7d4.scene7.com/is/image/WolverineWorldWide/MRLM-J06039-071816-S17-TOP?wid=3000&hei=2475&fmt=jpeg&qlt=80,0&op_sharpen=0&resMode=bilin&op_usm=0.5,1.0,8,0&iccEmbed=0&printRes=72'],
  price: 1000000,
  in_stock: 10
}, {
  id: '2',
  category_id: '2',
  owner_id: '2',
  name: 'Ba lô TNF',
  image_url: 'https://d2a2wjuuf1c30f.cloudfront.net/product_photos/65380347/file_c54337fa3f_original.jpg',
  thumbnails: ['https://images.thenorthface.com/is/image/TheNorthFace/NF0A3KV3_JK3_hero?$PDP-SCHEMA$', 'https://images.thenorthface.com/is/image/TheNorthFace/NF0A3KV3_JK3_hero?$PDP-SCHEMA$'],
  price: 200000,
  in_stock: 10
}, {
  id: '3',
  category_id: '3',
  owner_id: '3',
  name: 'Lều 4 người',
  image_url: 'https://i.pinimg.com/originals/a3/1a/2b/a31a2bf1349dabd6d35bf3dc01ec247d.png',
  thumbnails: ['https://www.rei.com/dam/skrobecki_071217_1458_tents_camping_choose_tents_for_camping_choose_lg.jpg', 'https://www.rei.com/dam/skrobecki_071217_1458_tents_camping_choose_tents_for_camping_choose_lg.jpg'],
  price: 200000,
  in_stock: 10
}, {
  id: '4',
  category_id: '4',
  owner_id: '4',
  name: 'Thiết bị GPS',
  image_url: 'https://www.beachcamera.com/shop/product-image.aspx?size=500&picId=513380',
  thumbnails: ['https://www.rei.com/dam/skrobecki_071217_1458_tents_camping_choose_tents_for_camping_choose_lg.jpg', 'https://www.rei.com/dam/skrobecki_071217_1458_tents_camping_choose_tents_for_camping_choose_lg.jpg'],
  price: 300000,
  in_stock: 10
}, {
  id: '5',
  category_id: '5',
  owner_id: '5',
  name: 'Xe win',
  image_url: 'https://motorvina.com/wp-content/uploads/2016/10/honda-win-rent-sell-buy-hue-da-nang-hoi-an-motorvina-hanoi-motorbike-rental-hue-motorbike-rental-da-nang-motorbike-rental-ho-chi-minh-motorbike-rentalsemi-bike-rental-honda-win-.jpg',
  price: 100000,
  thumbnails: ['https://blogcdn.muaban.net/wp-content/uploads/2019/09/honda-win-100-tem-doi-2000-2001.jpg', 'https://blogcdn.muaban.net/wp-content/uploads/2019/09/honda-win-100-tem-doi-2000-2001.jpg', 'https://blogcdn.muaban.net/wp-content/uploads/2019/09/honda-win-100-tem-doi-2000-2001.jpg'],
  in_stock: 10
}, {
  id: '6',
  owner_id: '5',
  category_id: '1',
  name: 'Giay Adidas',
  image_url: 'https://www.accenture.com/t20190307T103005Z__w__/ph-en/_acnmedia/Accenture/Conversion-Assets/DotCom/Images/Global-3/99/Accenture-Adidas-Header-Image.jpg',
  thumbnails: ['https://lh3.googleusercontent.com/proxy/6zDKTEOUZek7duAhIYuVS5OSDTieCrFAY8J0wj4wmo76ffxoJ52Pn_OXrUEUlPzryJF8IWELNcGSImbryTSI5Uz6rLY4sJK4lP_agTLKM_lkz_51M-g6j5ymAXyKvTLS0LAa', 'https://lh3.googleusercontent.com/proxy/6zDKTEOUZek7duAhIYuVS5OSDTieCrFAY8J0wj4wmo76ffxoJ52Pn_OXrUEUlPzryJF8IWELNcGSImbryTSI5Uz6rLY4sJK4lP_agTLKM_lkz_51M-g6j5ymAXyKvTLS0LAa'],
  price: 500000,
  in_stock: 10
}];
var carts = [{
  id: '1',
  owner_id: '1',
  product_details: {
    product_ids: [1, 2, 3],
    quantities: [3, 3, 4]
  },
  status: 'Unpaid',
  from_date: new Date('2021-01-01'),
  to_date: new Date('2021-01-05')
}, {
  id: '2',
  owner_id: '2',
  product_details: {
    product_ids: [2, 4, 6],
    quantities: [1, 3, 4]
  },
  status: 'Paid',
  from_date: new Date('2021-01-01'),
  to_date: new Date('2021-01-03')
}, {
  id: '3',
  owner_id: '3',
  product_details: {
    product_ids: [4, 7, 8],
    quantities: [2, 2, 2]
  },
  status: 'Shipped',
  from_date: new Date('2021-01-01'),
  to_date: new Date('2021-01-22')
}];
var users = [{
  id: '1',
  order_id: '1',
  first_name: 'Nguyen',
  last_name: 'Doan',
  gender: 'male',
  mobile: '0909123456',
  email: "nguyen.doan@gmail.com",
  address_longitude: 1.234,
  address_latitude: 9.123
}, {
  id: '2',
  order_id: '2',
  first_name: 'Toan',
  last_name: 'Nguyen',
  gender: 'male',
  mobile: '0123585145',
  email: "toan.nguyen@gmail.com",
  address_longitude: 2.234,
  address_latitude: 3.123
}, {
  id: '3',
  cart_id: '3',
  first_name: 'Duy',
  last_name: 'Nguyen',
  gender: 'male',
  mobile: '0914123456',
  email: "duy.nguyen@gmail.com",
  address_longitude: 3.234,
  address_latitude: 6.123
}];
var _default = {
  categories: categories,
  products: products,
  users: users,
  carts: carts
};
exports["default"] = _default;