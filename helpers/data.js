import bcrypt from 'bcryptjs';
const data = {
  users: [
    {
      name: 'John',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'Jane',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: "Chicken Burger",
      slug: "chicken-burger",
      category: "Burger",
      image: "/images/product_01.jpg",
      price: 24.0,
      rating: 5,
      numReviews: 23,
      countInStock: 102,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque. ",
    },
  
    {
      name: "Vegetarian Pizza",
      slug: "vegetarian-pizza",
      category: "Pizza",
      image: "/images/product_2.1.jpg",
      price: 115.0,
      rating: 5,
      numReviews: 23,
      countInStock: 102,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
    },
  
    {
      name: "Double Cheese Margherita",
      slug: "double-cheese",
      category: "Pizza",
      image: "/images/product_3.1.jpg",
      price: 110.0,
      rating: 4,
      numReviews: 29,
      countInStock: 10,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
    },
  
    {
      name: "Maxican Green Wave",
      slug: "maxican-green",
      category: "Pizza",
      image: "/images/product_4.1.jpg",
      price: 110.0,
      rating: 4,
      numReviews: 29,
      countInStock: 10,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
    },
  
    {
      name: "Cheese Burger",
      slug: "cheese-burger",
      category: "Burger",
      image: "/images/product_04.jpg",
      price: 24.0,
      rating: 4,
      numReviews: 29,
      countInStock: 10,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
    },
    {
      name: "Royal Cheese Burger",
      slug: "royal-cheese",
      category: "Burger",
      image: "/images/product_01.jpg",
      price: 24.0,
      rating: 5,
      numReviews: 24,
      countInStock: 130,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
    },
  
    {
      name: "Seafood Pizza",
      slug: "seafood-pizza",
      category: "Pizza",
      image: "/images/product_2.2.jpg",
      price: 115.0,
      rating: 5,
      numReviews: 24,
      countInStock: 130,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
    },
  
    {
      name: "Thin Cheese Pizza",
      slug: "thin-cheese",
      category: "Pizza",
      image: "/images/product_3.2.jpg",
      price: 110.0,
      rating: 5,
      numReviews: 24,
      countInStock: 130,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
    },
  
    {
      name: "Pizza With Mushroom",
      slug: "pizza-with",
      category: "Pizza",
      image: "/images/product_4.2.jpg",
      price: 110.0,
      rating: 5,
      numReviews: 24,
      countInStock: 130,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
    }
  ],
};
export default data;