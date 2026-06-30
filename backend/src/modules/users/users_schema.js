const {z} = require('zod');

const registerUserSchema = z.object({
    name : z.string(),
    email : z.string().email(),
    address : z.string().optional(),
    password : z.string()
}).refine(
    data =>
        Object.values(data).some(value => value !== undefined),
        {message: "At least one field must be provided for update"}
)

const updateUserSchema = z.object({
    name : z.string().optional(),
    email : z.string().email().optional(),
    password : z.string().optional(),
    address : z.string().optional()
}).refine(
    data =>
        Object.values(data).some(value => value !== undefined),
        {message: "At least one field must be provided for update"}
)

module.exports = {
    registerUserSchema,
    updateUserSchema
}