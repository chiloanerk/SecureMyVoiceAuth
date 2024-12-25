db.createCollection('user');
db.user.insertOne(
    {
        username: 'john',
        password: '123456',
        email: 'john@example.com',
        subscribedAt: new Date()
    }
)