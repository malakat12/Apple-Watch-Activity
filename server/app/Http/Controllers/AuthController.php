<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Passport\Client;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();
    
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    $client = Client::where('password_client', 1)->first();

    if (!$client) {
        return response()->json([
            'error' => 'OAuth server error',
            'message' => 'Password grant client not configured'
        ], 500);
    }

    $tokenRequest = Request::create('/oauth/token', 'POST', [
        'grant_type' => 'password',
        'client_id' => $client->id,
        'client_secret' => $client->secret,
        'username' => $request->email,
        'password' => $request->password,
        'scope' => '',
    ]);

    $response = app()->handle($tokenRequest);

    if ($response->getStatusCode() != 200) {
        return response()->json([
            'error' => 'OAuth error',
            'message' => 'Invalid credentials'
        ], 401);
    }

    return $response;
}
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
    
        return response()->json([
            'message' => 'User registered successfully.',
             'login_url' => '/oauth/token'
        ], 201);
    }
    
}