<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        $cart = Cart::with('items')
            ->firstOrCreate(
                ['user_id' => $user->id],
                ['transport' => null]
            );

        return response()->json([
            'cart' => $cart,
        ]);
    }

    public function addItem(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'product_id' => ['required', 'integer'],
            'name'       => ['required', 'string'],
            'price'      => ['required', 'numeric'],
            'quantity'   => ['nullable', 'integer', 'min:1'],
            'image_url'  => ['nullable', 'string'],
        ]);

        // default quantity = 1
        $qty = (int) ($data['quantity'] ?? 1);

        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['transport' => null]
        );

        // 🔧 FIX: no more DB::raw. We manually increment if item exists,
        // otherwise start from 0 so first add is exactly quantity = 1.
        $item = CartItem::firstOrNew([
            'cart_id'    => $cart->id,
            'product_id' => $data['product_id'],
        ]);

        // update core fields every time so price / name stay in sync
        $item->name      = $data['name'];
        $item->price     = $data['price'];          // will now be 3.50, not old 4.00
        $item->image_url = $data['image_url'] ?? null;

        $currentQty      = $item->exists ? (int) $item->quantity : 0;
        $item->quantity  = $currentQty + $qty;

        $item->save();

        // reload items relation
        $cart->load('items');

        return response()->json([
            'message' => 'Item added successfully',
            'cart'    => $cart,
            'item'    => $item,
        ], 201);
    }

    public function removeItem(Request $request, CartItem $item)
    {
        $user = $request->user();

        if ($item->cart->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $item->delete();

        return response()->json([
            'message' => 'Item removed',
        ]);
    }

    public function setTransport(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'transport' => ['required', 'string'],
        ]);

        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['transport' => null]
        );

        $cart->transport = $data['transport'];
        $cart->save();

        return response()->json([
            'message'  => 'Transport updated',
            'cart'     => $cart,
        ]);
    }

    protected function calculateDeliveryFee(?string $transport): float
    {
        return match ($transport) {
            'bike'        => 2.0,
            'motorcycle'  => 4.0,
            'car'         => 6.0,
            default       => 0.0,
        };
    }

    public function checkout(Request $request)
    {
        $user = $request->user();

        $cart = Cart::with('items')
            ->where('user_id', $user->id)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty',
            ], 422);
        }

        $transport   = $cart->transport;
        $deliveryFee = $this->calculateDeliveryFee($transport);

        $subtotal = $cart->items->reduce(function ($carry, CartItem $item) {
            return $carry + ($item->price * $item->quantity);
        }, 0.0);

        $total = $subtotal + $deliveryFee;

        DB::transaction(function () use ($user, $cart, $subtotal, $deliveryFee, $total, $transport) {
            // 1) create order
            $order = Order::create([
                'user_id'      => $user->id,
                'subtotal'     => $subtotal,
                'delivery_fee' => $deliveryFee,
                'total'        => $total,
                'transport'    => $transport,
                'status'       => 'placed',
            ]);

            // 2) copy items
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item->product_id,
                    'name'       => $item->name,
                    'price'      => $item->price,
                    'quantity'   => $item->quantity,
                    'image_url'  => $item->image_url,
                ]);
            }

            // 3) clear cart items (reset transport too)
            CartItem::where('cart_id', $cart->id)->delete();
            $cart->transport = null;
            $cart->save();
        });

        return response()->json([
            'message' => 'Order submitted successfully',
        ], 201);
    }
}
