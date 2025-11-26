<?php
use App\Models\User;
use function Pest\Laravel\postJson;

describe('Login', function() {
    it('returns the user data and token when successfully logged in', function() {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com'
        ]);

        $payload = [
            'email' => 'test@example.com',
            'password' => 'password'
        ];

        $response = postJson('/api/login', $payload);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'user' => [
                'id',
                'name',
                'email',
                'created_at',
                'updated_at',
            ],
            'token'
        ]);

        $response->assertJsonFragment([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    });

    it('returns a 401 error if credential are incorrect.', function() {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com'
        ]);

        $payload = [
            'email' => 'bademail@example.com',
            'password' => 'badpassword'
        ];

        $response = postJson('/api/login', $payload);

        $response->assertStatus(401);
        $response->assertJsonFragment([
            'error' => 'Invalid credentials'
        ]);
    });
});
