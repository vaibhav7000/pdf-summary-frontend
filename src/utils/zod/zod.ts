import * as z from "zod";


const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;


const emailSchema = z.email();

const changePasswordSchema = z.strictObject({
    password: z.string().trim().min(8, {
        error: "Password must contain atleat 8 characters",
        abort: true
    }).regex(passwordRegex, {
        error: "Password must contains atleast 1 uppercase, 1 lowercase, 1 number, 1 special character"
    }),
    
    confirm: z.string().trim()
}).refine(data => data.password === data.confirm, {
    path: ["confirm"],
    error: "Password does not match",
    abort: true,

    when(payload) {
        return changePasswordSchema.pick({
            password: true, confirm: true
        }).safeParse(payload.value).success
    }
});


const registerSchema = z.strictObject({

    password: z.string().trim().min(8, {
        abort: true,
        error: "Password must be atleast 8 characters long"
    }).regex(passwordRegex, {
        error: "Password must contain atleat 1 uppercase, 1 lowercase, 1 number and 1 special Character"
    }),
    confirm: z.string(),
    firstname: z.string().trim().min(1),
    lastname: z.string().trim().min(1),
    email: z.email(),
}).refine(data => data.confirm === data.password, {
    path: ["confirm"],
    error: "Password does not match",

    when(payload) {
        return registerSchema.pick({
            password: true, confirm: true
        }).safeParse(payload.value).success
    }
})


export {
    emailSchema, changePasswordSchema, registerSchema
}