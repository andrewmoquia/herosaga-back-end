export interface IMongoUser {
    _id: string,
    username: String,
    password: String,
    email: String,
    isVerified: Boolean,
    googleId: String,
    provider: String,
    _v: number
}
