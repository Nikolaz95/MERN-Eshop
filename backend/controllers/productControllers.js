import catchAsynchErrors from "../middlewares/catchAsynchErrors.js";
import Product from "../models/product.js"
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";


// Create new Product   =>  /api/v1/products
export const getProducts = catchAsynchErrors(async(req, res, next) => {

    const resPerPage = 4;
    const apiFilters = new APIFilters(Product, req.query).search().filters();

    console.log("req?.user", req?.user);


    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    /* return next(new ErrorHandler("Products Error", 400))  */

    
    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();


    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products,
    });
});


// Create new Product   =>  /api/v1/admin/products
export const newProduct = catchAsynchErrors( async(req, res) => {

    req.body.user = req.user._id

    const product = await Product.create(req.body)

    res.status(200).json({
        product,
    });
});

// Get single product details =>  /api/v1/products/:id
export const getProductDetails = catchAsynchErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params?.id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    res.status(200).json({
      product,
    });
  });


  // Get products = ADMIN =>  /api/v1/admin/products
export const getAdminProducts = catchAsynchErrors(async (req, res, next) => {
  const products = await Product.find()

  
  res.status(200).json({
    products,
  });
});


// Update product details   =>  /api/v1/products/:id
export const updateProduct = catchAsynchErrors(async (req, res) => {
    let product = await Product.findById(req?.params?.id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
      new: true,
    });
  
    res.status(200).json({
      product,
    });
  });


  // Upload product images   =>  /api/v1/admin/products/:id/upload_images
export const uploadProductImages = catchAsynchErrors(async (req, res) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const uploader = async (image) => upload_file(image, "shopit/products");

  const urls = await Promise.all((req?.body?.images).map(uploader));

  product?.images?.push(...urls);
  await product?.save();

  res.status(200).json({
    product,
  });
});

// Delete product image   =>  /api/v1/admin/products/:id/delete_image
export const deleteProductImage = catchAsynchErrors(async (req, res) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isDeleted = await delete_file(req.body.imgId);

  if (isDeleted) {
    product.images = product?.images?.filter(
      (img) => img.public_id !== req.body.imgId
    );

    await product?.save();
  }

  res.status(200).json({
    product,
  });
});




  
  // Delete product   =>  /api/v1/products/:id
  export const deleteProduct = catchAsynchErrors(async (req, res) => {
    const product = await Product.findById(req?.params?.id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Deleting image associated with product
  for (let i = 0; i < product?.images?.length; i++) {
    await delete_file(product?.images[i].public_id);
  }
  
    await product.deleteOne();
  
    res.status(200).json({
      message: "Product Deleted",
    });
  });



    // Create/Update product  review =>  /api/v1/review
    export const createProductReview = catchAsynchErrors(async (req, res) => {
      const {rating, comment, productId} = req.body

      const review = {
        user: req?.user?._id,
        rating: Number(rating),
        comment,
      };


      const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isReviewed = product?.reviews?.find(
    (r) => r.user.toString() === req?.user?._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});



    // get product  reviews =>  /api/v1/reviews
    export const getProductReviews = catchAsynchErrors(async (req, res, next) => {
      const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    reviews: product.reviews,
  });
    })


    // Delete product review   =>  /api/v1/admin/reviews
export const deleteReview = catchAsynchErrors(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product?.reviews?.filter(
    (review) => review._id.toString() !== req?.query?.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
      numOfReviews === 0 
      ? 0 
      : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      numOfReviews;

    product = await Product.findByIdAndUpdate(
        req.query.productId,
        { reviews, numOfReviews, ratings },
        { new: true }
      );

      await product.save({validateBeforeSave: false})


  res.status(200).json({
    success: true,
    product,
  });
});