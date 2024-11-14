const Order = require('../models/order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.paymentIntent = async ctx => {
  try {
    const product = ctx.request.body;
    const price = Number(product.price);
    const amount = price * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'usd',
      amount: amount,
      payment_method_types: ['card'],
    });

    ctx.body = {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getAllOrders = async ctx => {
  try {
    const query = {};
    if (ctx.query.keyword) {
      query.searchIndex = { $regex: ctx.query.keyword, $options: 'i' };
    }
    const orders = await Order.find(query)
      .select('-__v')
      .populate('userData', '-_v')
      .lean({ virtuals: true });
    ctx.body = orders;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getOrdersByUser = async ctx => {
  try {
    const userId = ctx.params.id;
    const orderItems = await Order.find({ user: userId }).populate(
      'userData',
      '-_v',
    );

    // Count orders by status
    const stats = await Order.aggregate([
      { $match: { user: userId } }, // Ensure only the user's orders are counted
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    let totalDoc = 0;
    let pending = 0;
    let processing = 0;
    let delivered = 0;
    let cancel = 0;

    stats.forEach(stat => {
      totalDoc += stat.count;
      switch (stat._id) {
        case 'pending':
          pending = stat.count;
          break;
        case 'processing':
          processing = stat.count;
          break;
        case 'delivered':
          delivered = stat.count;
          break;
        case 'cancel':
          cancel = stat.count;
          break;
        default:
          break;
      }
    });

    ctx.body = {
      data: orderItems,
      totalDoc,
      pending,
      processing,
      delivered,
      cancel,
    };
  } catch (err) {
    console.error('Error fetching orders for user:', err);
    ctx.throw(500, 'Error fetching user orders');
  }
};

exports.getOrder = async ctx => {
  try {
    const id = ctx.params.id;
    const order = await Order.findById(id);
    if (!order) {
      ctx.throw(404, 'Order not found');
    }

    ctx.body = order;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.createOrder = async ctx => {
  try {
    const orderItems = await Order.create(ctx.request.body);

    ctx.body = {
      success: true,
      message: 'Order added successfully',
      order: orderItems,
    };
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.updateOrderStatus = async ctx => {
  try {
    const { newStatus } = ctx.request.body;
    const order = await Order.findByIdAndUpdate(
      ctx.params.id,
      { status: newStatus },
      { new: true },
    );
    if (!order) {
      ctx.throw(404, 'Order not found');
    }
    ctx.body = order;
  } catch (err) {
    ctx.throw(500, err);
  }
};
