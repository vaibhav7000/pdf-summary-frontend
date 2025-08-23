import * as z from "zod";


const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;


const emailSchema = z.email();

const changePasswordSchema = z.strictObject({
    password: z.string().trim().regex(passwordRegex),
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
})


export {
    emailSchema, changePasswordSchema
}