<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    protected function forUser($user)
    {
        return Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['transport' => null]
        );
    }

    public function show(Request $request)
    {
        $user = $request->user();
        $cart = Cart::with('items')->firstOrCreate(
            ['user_id' => $user->id],
            ['transport' => null]
        );

        return response()->json([
            'id'        => $cart->id,
            'transport' => $cart->transport,
            'items'     => $cart->items->map(function (CartItem $item) {
                return [
                    'id'         => $item->id,
                    'product_id' => $item->product_id,
                    'name'       => $item->name,
                    'price'      => (float) $item->price,
                    'quantity'   => (int) $item->quantity,
                    'image_url'  => $item->image_url,
                ];
            })->values(),
        ]);
    }

    public function addItem(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'product_id' => 'nullable|integer',
            'name'       => 'required|string|max:255',
            'price'      => 'required|numeric|min:0',
            'quantity'   => 'nullable|integer|min:1',
            'image_url'  => 'nullable|string|max:2048',
        ]);

        $quantity = $data['quantity'] ?? 1;

        $cart = $this->forUser($user);

        // If same product already exists, bump quantity
        $item = $cart->items()
            ->where('product_id', $data['product_id'] ?? null)
            ->where('name', $data['name'])
            ->first();

        if ($item) {
            $item->quantity += $quantity;
            $item->save();
        } else {
            $item = $cart->items()->create([
                'product_id' => $data['product_id'] ?? null,
                'name'       => $data['name'],
                'price'      => $data['price'],
                'quantity'   => $quantity,
                'image_url'  => $data['image_url'] ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Item Added successfully',
            'item'    => $item,
        ], 201);
    }

    public function removeItem(Request $request, $id)
    {
        $user = $request->user();
        $cart = $this->forUser($user);

        $item = $cart->items()->where('id', $id)->first();

        if (! $item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $item->delete();

        return response()->json(['message' => 'Item removed']);
    }

    public function setTransport(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'transport' => 'required|in:bike,motorcycle,car',
        ]);

        $cart = $this->forUser($user);
        $cart->transport = $data['transport'];
        $cart->save();

        return response()->json([
            'message'   => 'Transport updated',
            'transport' => $cart->transport,
        ]);
    }

    public function checkout(Request $request)
    {
        $user = $request->user();
        $cart = $this->forUser($user);
        $cart->load('items');

        if ($cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        // Real app: create Order, etc. Here we just clear cart.
        foreach ($cart->items as $item) {
            $item->delete();
        }
        $cart->transport = null;
        $cart->save();

        return response()->json(['message' => 'Order submitted successfully']);
    }
}
